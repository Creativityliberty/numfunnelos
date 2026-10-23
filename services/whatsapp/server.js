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

// Clé interne partagée avec l'API FastAPI : le service ne doit jamais être exposé sans elle.
const INTERNAL_KEY = process.env.WHATSAPP_INTERNAL_KEY || '';
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  if (INTERNAL_KEY && req.get('X-Internal-Key') !== INTERNAL_KEY) {
    return res.status(401).json({ error: 'Accès refusé' });
  }
  next();
});

const PORT = process.env.PORT || 3001;
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '33';
const SESSIONS_DIR = process.env.SESSIONS_DIR || path.join(__dirname, 'sessions');
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
    this.names = new Map(); // jid -> nom affiché
    this.lastActive = Date.now();
  }

  formatJid(input) {
    if (!input) return null;
    let clean = String(input).trim();
    if (clean.endsWith('@s.whatsapp.net') || clean.endsWith('@g.us')) return clean;
    clean = clean.replace(/[^0-9]/g, '');
    if (!clean) return null;
    if (clean.startsWith('00')) clean = clean.slice(2);
    else if (clean.startsWith('0')) clean = DEFAULT_COUNTRY_CODE + clean.slice(1);
    return `${clean}@s.whatsapp.net`;
  }

  // Normalise un numero puis verifie qu'il possede un compte WhatsApp.
  async resolveJid(input) {
    const jid = this.formatJid(input);
    if (!jid) return { jid: null, exists: false };
    if (jid.endsWith('@g.us')) return { jid, exists: true };
    try {
      const [res] = await this.sock.onWhatsApp(jid.split('@')[0]);
      if (res && res.exists) return { jid: res.jid, exists: true };
      return { jid, exists: false };
    } catch (e) {
      return { jid, exists: true };
    }
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

    sock.ev.on('messages.upsert', ({ messages }) => {
      for (const m of messages) this.ingestMessage(m);
    });

    // Historique initial envoyé par WhatsApp à la liaison de l'appareil
    sock.ev.on('messaging-history.set', ({ chats = [], contacts = [], messages = [] }) => {
      for (const c of contacts) this.rememberName(c.id, c.name || c.notify);
      for (const c of chats) {
        if (!c.id || c.id === 'status@broadcast') continue;
        this.rememberName(c.id, c.name);
        if (!this.chats.has(c.id)) {
          this.chats.set(c.id, {
            jid: c.id,
            name: c.name || this.names.get(c.id) || c.id.split('@')[0],
            lastMessage: '',
            timestamp: Number(c.conversationTimestamp || 0) * 1000,
            isGroup: c.id.endsWith('@g.us'),
            unread: c.unreadCount || 0
          });
        }
      }
      for (const m of messages) this.ingestMessage(m, true);
    });

    sock.ev.on('contacts.upsert', (list) => {
      for (const c of list) this.rememberName(c.id, c.name || c.notify);
    });
  }

  rememberName(jid, name) {
    if (!jid || !name) return;
    this.names.set(jid, name);
    const chat = this.chats.get(jid);
    if (chat) chat.name = name;
  }

  ingestMessage(m, fromHistory = false) {
    if (!m || !m.message) return;
    const jid = m.key.remoteJid;
    if (!jid || jid === 'status@broadcast') return;

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      m.message.buttonsResponseMessage?.selectedButtonId ||
      '[Média ou document]';

    const timestamp = Number(m.messageTimestamp || Date.now() / 1000) * 1000;
    const fromMe = !!m.key.fromMe;
    if (!fromMe && m.pushName) this.rememberName(jid, jid.endsWith('@g.us') ? null : m.pushName);

    const list = this.messages.get(jid) || [];
    if (list.some((x) => x.id === m.key.id)) return;
    list.push({ id: m.key.id, jid, fromMe, text, timestamp, pushName: m.pushName || (fromMe ? 'Moi' : jid.split('@')[0]) });
    list.sort((x, y) => x.timestamp - y.timestamp);
    if (list.length > 100) list.shift();
    this.messages.set(jid, list);

    const chat = this.chats.get(jid) || {
      jid,
      name: this.names.get(jid) || jid.split('@')[0],
      lastMessage: '',
      timestamp: 0,
      isGroup: jid.endsWith('@g.us'),
      unread: 0
    };
    if (timestamp >= chat.timestamp) {
      chat.lastMessage = text;
      chat.timestamp = timestamp;
    }
    if (!fromMe && !fromHistory) chat.unread += 1;
    this.chats.set(jid, chat);
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

  const target = await s.resolveJid(rawJid);
  if (!target.jid) return res.status(400).json({ error: 'Numéro invalide' });
  if (!target.exists) return res.status(400).json({ error: "Ce numéro n'est associé à aucun compte WhatsApp" });
  const jid = target.jid;

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

    res.json({ ok: true, id: result.key.id, jid });
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
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'Nom du groupe obligatoire' });

  try {
    const jids = [];
    const skipped = [];
    for (const p of participants) {
      const r = await s.resolveJid(p);
      if (r.jid && r.exists) jids.push(r.jid);
      else skipped.push(String(p));
    }
    const group = await s.sock.groupCreate(String(name).trim(), jids);
    let invite_link = null;
    try {
      const code = await s.sock.groupInviteCode(group.id);
      invite_link = `https://chat.whatsapp.com/${code}`;
    } catch (e) {}
    res.json({ ok: true, group: { id: group.id, subject: group.subject }, invite_link, skipped });
  } catch (err) {
    res.status(500).json({ error: `Création du groupe impossible : ${err.message}` });
  }
});

const ADD_STATUS_REASONS = {
  '403': "Ajout direct refusé (confidentialité du contact ou droits administrateur insuffisants). Utilisez le lien d'invitation.",
  '408': 'Le contact a quitté ce groupe récemment.',
  '409': 'Ce contact est déjà membre du groupe.',
  '401': "Vous n'êtes pas administrateur de ce groupe."
};

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

  const target = await s.resolveJid(phone);
  if (!target.jid) return res.status(400).json({ error: 'Numéro invalide' });
  if (!target.exists) return res.status(400).json({ error: "Ce numéro n'est associé à aucun compte WhatsApp" });

  try {
    const [result] = await s.sock.groupParticipantsUpdate(groupJid, [target.jid], 'add');
    const status = String(result?.status || '');
    if (status === '200') return res.json({ ok: true, jid: target.jid });

    let invite_link = null;
    try {
      const code = await s.sock.groupInviteCode(groupJid);
      invite_link = `https://chat.whatsapp.com/${code}`;
    } catch (e) {}
    res.json({
      ok: false,
      status,
      jid: target.jid,
      invite_link,
      privacy_restricted: status === '403',
      error: ADD_STATUS_REASONS[status] || `Ajout refusé par WhatsApp (code ${status || 'inconnu'}).`
    });
  } catch (err) {
    res.status(500).json({ error: `Ajout impossible : ${err.message}` });
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

app.listen(PORT, process.env.HOST || '0.0.0.0', () => {
  console.log(`[WhatsApp Baileys Service] Listening on port ${PORT}`);
});
