const express = require('express');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SESSIONS_DIR = path.join(__dirname, 'sessions');
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// Map: workspaceId -> SessionObject
const sessions = new Map();

class WorkspaceSession {
  constructor(workspaceId) {
    this.workspaceId = workspaceId;
    this.sessionDir = path.join(SESSIONS_DIR, workspaceId);
    this.sock = null;
    this.status = 'disconnected'; // 'disconnected' | 'scan_needed' | 'connected'
    this.qr = null;
    this.user = null;
    this.chats = new Map(); // jid -> { jid, name, lastMessage, timestamp, unread }
    this.messages = new Map(); // jid -> [ { id, fromMe, text, timestamp, pushName } ]
    this.groups = new Map(); // jid -> groupMetadata
    this.lastActive = Date.now();
  }

  formatJid(input) {
    if (!input) return null;
    let clean = String(input).trim();
    if (clean.endsWith('@s.whatsapp.net') || clean.endsWith('@g.us')) return clean;
    clean = clean.replace(/[^0-9]/g, '');
    if (!clean) return null;
    return `${clean}@s.whatsapp.net`;
  }

  async init() {
    if (this.sock && (this.status === 'connected' || this.status === 'scan_needed')) {
      return;
    }

    const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);
    const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] }));

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['Nüptin OS', 'Chrome', '124.0.0'],
      syncFullHistory: false
    });

    this.sock = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.status = 'scan_needed';
        try {
          this.qr = await qrcode.toDataURL(qr);
        } catch (err) {
          this.qr = qr;
        }
      }

      if (connection === 'open') {
        this.status = 'connected';
        this.qr = null;
        this.user = sock.user;
        this.lastActive = Date.now();
        console.log(`[WhatsApp] Workspace ${this.workspaceId} connected:`, sock.user?.id);
        
        // Rafraîchir les groupes au démarrage
        try {
          const fetchedGroups = await sock.groupFetchAllParticipating();
          for (const [gid, meta] of Object.entries(fetchedGroups)) {
            this.groups.set(gid, meta);
          }
        } catch (e) {}
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(`[WhatsApp] Workspace ${this.workspaceId} disconnected:`, statusCode, 'Reconnect:', shouldReconnect);

        if (statusCode === DisconnectReason.loggedOut) {
          this.status = 'disconnected';
          this.qr = null;
          this.user = null;
          this.sock = null;
          try {
            fs.rmSync(this.sessionDir, { recursive: true, force: true });
          } catch (e) {}
        } else if (shouldReconnect) {
          this.status = 'reconnecting';
          setTimeout(() => this.init(), 3000);
        } else {
          this.status = 'disconnected';
          this.sock = null;
        }
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      for (const m of messages) {
        if (!m.message) continue;
        const jid = m.key.remoteJid;
        if (!jid || jid === 'status@broadcast') continue;

        const text =
          m.message.conversation ||
          m.message.extendedTextMessage?.text ||
          m.message.imageMessage?.caption ||
          m.message.videoMessage?.caption ||
          (m.message.buttonsResponseMessage?.selectedButtonId) ||
          '[Média ou document]';

        const timestamp = Number(m.messageTimestamp || Date.now() / 1000) * 1000;
        const fromMe = !!m.key.fromMe;
        const pushName = m.pushName || (fromMe ? 'Moi' : jid.split('@')[0]);

        const msgObj = {
          id: m.key.id,
          jid,
          fromMe,
          text,
          timestamp,
          pushName
        };

        if (!this.messages.has(jid)) {
          this.messages.set(jid, []);
        }
        const chatMsgs = this.messages.get(jid);
        chatMsgs.push(msgObj);
        if (chatMsgs.length > 100) chatMsgs.shift();

        // Update chat summary
        let chat = this.chats.get(jid) || {
          jid,
          name: pushName,
          lastMessage: text,
          timestamp,
          isGroup: jid.endsWith('@g.us'),
          unread: 0
        };
        chat.lastMessage = text;
        chat.timestamp = timestamp;
        if (!fromMe) chat.unread += 1;
        this.chats.set(jid, chat);
      }
    });
  }

  async logout() {
    if (this.sock) {
      try {
        await this.sock.logout();
      } catch (e) {}
      this.sock = null;
    }
    this.status = 'disconnected';
    this.qr = null;
    this.user = null;
    try {
      fs.rmSync(this.sessionDir, { recursive: true, force: true });
    } catch (e) {}
  }

  async waitForQrOrConnection(timeoutMs = 6000) {
    if (this.status === 'connected' || this.qr) {
      return { status: this.status, qr: this.qr, user: this.user };
    }
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (this.status === 'connected' || this.qr) {
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    return { status: this.status, qr: this.qr, user: this.user };
  }
}

function getSession(wid) {
  if (!sessions.has(wid)) {
    sessions.set(wid, new WorkspaceSession(wid));
  }
  return sessions.get(wid);
}

// --- Endpoints ---

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', version: '1.0.0', uptime: process.uptime() });
});

// Statut
app.get('/status/:wid', async (req, res) => {
  const { wid } = req.params;
  const s = getSession(wid);
  res.json({
    workspace_id: wid,
    status: s.status,
    connected: s.status === 'connected',
    user: s.user,
    qr: s.qr
  });
});

// Connexion / Demande de QR
app.post('/connect/:wid', async (req, res) => {
  const { wid } = req.params;
  const s = getSession(wid);
  try {
    await s.init();
    await s.waitForQrOrConnection(6000);
    res.json({
      workspace_id: wid,
      status: s.status,
      connected: s.status === 'connected',
      qr: s.qr,
      user: s.user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Déconnexion
app.post('/disconnect/:wid', async (req, res) => {
  const { wid } = req.params;
  const s = getSession(wid);
  await s.logout();
  res.json({ ok: true, status: 'disconnected' });
});

// Liste des conversations (chats)
app.get('/chats/:wid', async (req, res) => {
  const { wid } = req.params;
  const s = getSession(wid);
  const list = Array.from(s.chats.values()).sort((a, b) => b.timestamp - a.timestamp);
  res.json({ chats: list });
});

// Messages d'un chat
app.get('/messages/:wid', async (req, res) => {
  const { wid } = req.params;
  const { jid } = req.query;
  const s = getSession(wid);
  if (!jid) return res.status(400).json({ error: 'JID requis' });
  const msgs = s.messages.get(jid) || [];
  res.json({ jid, messages: msgs });
});

// Envoi d'un message direct
app.post('/send/:wid', async (req, res) => {
  const { wid } = req.params;
  const { jid: rawJid, text } = req.body;
  const s = getSession(wid);

  if (s.status !== 'connected' || !s.sock) {
    return res.status(400).json({ error: 'WhatsApp non connecté pour ce workspace' });
  }
  if (!rawJid || !text) {
    return res.status(400).json({ error: 'JID et texte obligatoires' });
  }

  const jid = s.formatJid(rawJid);
  if (!jid) return res.status(400).json({ error: 'Numéro ou JID invalide' });

  try {
    const result = await s.sock.sendMessage(jid, { text: String(text).trim() });
    
    // Enregistrer localement dans l'historique
    const timestamp = Date.now();
    const msgObj = {
      id: result.key.id,
      jid,
      fromMe: true,
      text: String(text).trim(),
      timestamp,
      pushName: 'Moi'
    };
    if (!s.messages.has(jid)) s.messages.set(jid, []);
    s.messages.get(jid).push(msgObj);

    let chat = s.chats.get(jid) || {
      jid,
      name: jid.split('@')[0],
      lastMessage: text,
      timestamp,
      isGroup: jid.endsWith('@g.us'),
      unread: 0
    };
    chat.lastMessage = text;
    chat.timestamp = timestamp;
    s.chats.set(jid, chat);

    res.json({ ok: true, id: result.key.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Groupes WhatsApp
app.get('/groups/:wid', async (req, res) => {
  const { wid } = req.params;
  const s = getSession(wid);
  if (s.status !== 'connected' || !s.sock) {
    return res.json({ groups: [] });
  }
  try {
    const fetched = await s.sock.groupFetchAllParticipating();
    const list = Object.values(fetched).map((g) => ({
      id: g.id,
      subject: g.subject,
      owner: g.owner,
      creation: g.creation,
      size: g.size || (g.participants ? g.participants.length : 0),
      desc: g.desc
    }));
    res.json({ groups: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un groupe
app.post('/groups/:wid', async (req, res) => {
  const { wid } = req.params;
  const { name, participants = [] } = req.body;
  const s = getSession(wid);
  if (s.status !== 'connected' || !s.sock) {
    return res.status(400).json({ error: 'WhatsApp non connecté' });
  }
  if (!name) return res.status(400).json({ error: 'Nom du groupe obligatoire' });

  try {
    const jids = participants.map((p) => s.formatJid(p)).filter(Boolean);
    const result = await s.sock.groupCreate(name, jids);
    res.json({ ok: true, group: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un participant à un groupe
app.post('/groups/:wid/add', async (req, res) => {
  const { wid } = req.params;
  const { groupJid, phone } = req.body;
  const s = getSession(wid);
  if (s.status !== 'connected' || !s.sock) {
    return res.status(400).json({ error: 'WhatsApp non connecté' });
  }
  if (!groupJid || !phone) {
    return res.status(400).json({ error: 'groupJid et phone obligatoires' });
  }

  const phoneJid = s.formatJid(phone);
  try {
    const response = await s.sock.groupParticipantsUpdate(groupJid, [phoneJid], 'add');
    res.json({ ok: true, result: response });
  } catch (err) {
    // Si l'ajout direct échoue à cause de restrictions de confidentialité WhatsApp du contact,
    // récupérer le code d'invitation pour lui transmettre directement
    try {
      const code = await s.sock.groupInviteCode(groupJid);
      res.json({
        ok: false,
        privacy_restricted: true,
        invite_code: code,
        invite_link: `https://chat.whatsapp.com/${code}`,
        error: 'Le contact requiert un lien d’invitation'
      });
    } catch (e2) {
      res.status(500).json({ error: err.message });
    }
  }
});

// Obtenir le lien d'invitation d'un groupe
app.get('/groups/:wid/invite', async (req, res) => {
  const { wid } = req.params;
  const { groupJid } = req.query;
  const s = getSession(wid);
  if (s.status !== 'connected' || !s.sock) {
    return res.status(400).json({ error: 'WhatsApp non connecté' });
  }
  if (!groupJid) return res.status(400).json({ error: 'groupJid requis' });

  try {
    const code = await s.sock.groupInviteCode(groupJid);
    res.json({ ok: true, code, link: `https://chat.whatsapp.com/${code}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WhatsApp Baileys Service] Listening on port ${PORT}`);
});
