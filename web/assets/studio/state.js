/**
 * Nüptin Studio — Central Reactive State & Shared Constants
 */
export const $ = (s) => document.querySelector(s);

export const E = (s) => String(s ?? '').replace(/[&<>"']/g, x => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[x]));

export const pretty = {
  overview: 'Vue d’ensemble',
  funnels: 'Mes tunnels',
  builder: 'Éditeur de tunnel',
  contacts: 'CRM & Contacts',
  bookings: 'Calendrier',
  whatsapp: 'WhatsApp Live & Groupes',
  inbox: 'Messagerie & Inbox',
  automations: 'Automatisations',
  analytics: 'Rapports & Analyses',
  tracking: 'Acquisition & Attribution',
  integrations: 'Intégrations',
  docs: 'API & Documentation',
  team: 'Espaces de travail',
  settings: 'Paramètres du compte'
};

export const S = {
  me: null,
  csrf: '',
  wid: '',
  page: 'overview',
  data: {},
  selected: null,
  tab: 'overview',
  builderTab: '01',
  authMode: 'register',
  googleEnabled: false,
  lastMcpToken: null,
  modal: null,
  mobile: false,
  busy: false,
  collapsed: localStorage.getItem('nuptin-sidebar-collapsed') === 'true'
};

export const pageMap = {};

