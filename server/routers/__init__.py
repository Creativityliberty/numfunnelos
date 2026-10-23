from __future__ import annotations
from .health import router as health_router
from .auth import router as auth_router
from .workspaces import router as workspaces_router
from .funnels import router as funnels_router
from .public import router as public_router
from .crm import router as crm_router
from .automations import router as automations_router
from .integrations import router as integrations_router
from .realtime import router as realtime_router
from .mcp import router as mcp_router
from .whatsapp import router as whatsapp_router

__all__ = [
    'health_router',
    'auth_router',
    'workspaces_router',
    'funnels_router',
    'public_router',
    'crm_router',
    'automations_router',
    'integrations_router',
    'realtime_router',
    'mcp_router',
    'whatsapp_router'
]
