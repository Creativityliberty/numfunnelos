/**
 * Nüptin Studio — Modular Entry Point
 * Architecture modulaire v1.5
 */
import { icons } from './icons.js';
import {
  $, E, S, live, stopLive, startLive, toast, api, spinner,
  userAvatar, sidebar, nav, shell, head, kpi, graph, fmtDate, pillStatus,
  load, refreshAuth, go, saveBuilder, pretty, pageMap, registerPages
} from './core.js';

import { pageOverview } from './pages_overview.js';
import { pageFunnels, funnelRow } from './pages_funnels.js';
import { pageBuilder } from './pages_builder.js';
import { pageContacts } from './pages_contacts.js';
import { pageBookings } from './pages_bookings.js';
import { pageWhatsApp } from './pages_whatsapp.js';
import { pageInbox } from './pages_inbox.js';
import { pageAutomations } from './pages_automations.js';
import { pageAnalytics, pageTracking, eventTable } from './pages_analytics.js';
import { pageIntegrations } from './pages_integrations.js';
import { pageTeam } from './pages_team.js';
import { pageSettings } from './pages_settings.js';
import { pageDocs, academyTabContent } from './pages_docs.js';
import { modalHtml } from './modals.js';
import { registerEventListeners } from './events.js';

