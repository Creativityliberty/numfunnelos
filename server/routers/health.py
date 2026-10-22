from __future__ import annotations
from fastapi import APIRouter

router = APIRouter(tags=['Système & Santé'])

@router.get('/api/health', summary='Vérification de la santé opérationnelle de la plateforme')
def health():
    return {'ok': True, 'product': 'NÜM Funnel OS', 'version': '1.3.0'}
