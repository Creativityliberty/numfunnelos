"""Supervise le microservice Baileys (Node) embarqué dans le même conteneur que l'API.

Le service n'écoute que sur 127.0.0.1 : il n'est jamais exposé publiquement.
Désactivable avec WHATSAPP_EMBEDDED=false (service déployé séparément).
"""
from __future__ import annotations
import asyncio
import logging
import os
import shutil
from pathlib import Path

log = logging.getLogger('whatsapp_runner')

ROOT = Path(__file__).resolve().parent.parent
SERVICE_DIR = ROOT / 'services' / 'whatsapp'
SERVER_JS = SERVICE_DIR / 'server.js'


def embedded_enabled() -> bool:
    return os.getenv('WHATSAPP_EMBEDDED', 'true').lower() == 'true' and SERVER_JS.exists()


async def supervise() -> None:
    node = shutil.which('node')
    if not node:
        log.warning('node introuvable : service WhatsApp embarqué non démarré')
        return
    env = {
        **os.environ,
        'PORT': os.getenv('WHATSAPP_PORT', '3001'),
        'HOST': '127.0.0.1',
        'SESSIONS_DIR': os.getenv('SESSIONS_DIR', str(SERVICE_DIR / 'sessions')),
    }
    proc = None
    try:
        while True:
            proc = await asyncio.create_subprocess_exec(node, str(SERVER_JS), cwd=str(SERVICE_DIR), env=env)
            log.info('service WhatsApp démarré (pid %s)', proc.pid)
            code = await proc.wait()
            log.warning('service WhatsApp arrêté (code %s), redémarrage dans 3 s', code)
            await asyncio.sleep(3)
    except asyncio.CancelledError:
        if proc and proc.returncode is None:
            proc.terminate()
        raise
