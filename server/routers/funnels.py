from __future__ import annotations
import json
import secrets
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func, delete
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Membership, Funnel, FunnelVersion
from ..schemas import FunnelIn, PatchFunnel
from ..security import slug
from ..dependencies import tenant, owner_only

ROOT = Path(__file__).resolve().parent.parent.parent

router = APIRouter(tags=['Tunnels de conversion'])

def load_app7():
    p = ROOT / 'templates' / 'app7.json'
    j = json.loads(p.read_text('utf-8'))
    j['copy'] = {
        'eyebrow': 'CRÉEZ VOTRE PREMIÈRE APPLICATION AVEC L’IA',
        'title': 'Votre idée mérite mieux que de rester une idée.',
        'subtitle': 'Une première application simple, en ligne et prête à être commercialisée en 7 jours, avec l’IA et une méthode structurée.',
        'capture_cta': 'Accéder à la présentation offerte',
        'curriculum_eyebrow': 'LE PROGRAMME EN DÉTAIL',
        'curriculum_title': 'Un parcours étape par étape.',
        'curriculum_desc': 'Sept étapes logiques et structurées : cadrer, construire, vérifier et préparer la commercialisation.',
        'training_title': 'Une idée. Sept jours. Votre première application.',
        'training_cta': 'Je lance mon application',
        'thank_you': 'Votre projet commence maintenant.'
    }
    j['chapters'] = [
        {'name': 'Le déclic', 'title': 'Votre idée mérite mieux que de rester une idée.'},
        {'name': 'Le vrai problème', 'title': 'Générer une app ne suffit pas. Il faut savoir la terminer.'},
        {'name': 'Pourquoi Lionel', 'title': 'Piloter l’IA, pas simplement lui demander du code.'},
        {'name': 'Changer de modèle', 'title': 'Partez d’un problème réel, construisez une solution utile.'},
        {'name': 'Les 7 jours', 'title': 'Idée, design, construction, données, monétisation, publication, lancement.'},
        {'name': 'Monétiser', 'title': 'Un produit commercialisable n’est pas un revenu garanti.'},
        {'name': 'Ce que vous apprendrez', 'title': 'Un processus réutilisable, et pas une collection de prompts.'},
        {'name': 'La démonstration', 'title': 'Une application opérationnelle vaut mieux qu’une promesse.'},
        {'name': 'Vos questions', 'title': 'Commencez avec un périmètre volontairement simple.'},
        {'name': 'Le passage à l’action', 'title': 'Construisez, publiez, faites tester, améliorez.'},
        {'name': 'L’invitation APP 7', 'title': 'Votre idée mérite enfin de rencontrer la réalité.'}
    ]
    j['days'] = [
        {'day': '01', 'title': 'Clarifier', 'sub': 'Idée & Vision', 'icon': '', 'image': '', 'status': 'available', 'enabled': True},
        {'day': '02', 'title': 'Dessiner', 'sub': 'UX/UI & Parcours', 'icon': '', 'image': '', 'status': 'available', 'enabled': True},
        {'day': '03', 'title': 'Construire', 'sub': 'Fonctions & IA', 'icon': '', 'image': '', 'status': 'available', 'enabled': True},
        {'day': '04', 'title': 'Structurer', 'sub': 'Données & BDD', 'icon': '', 'image': '', 'status': 'available', 'enabled': True},
        {'day': '05', 'title': 'Monétiser', 'sub': 'Offre & Pricing', 'icon': '', 'image': '', 'status': 'available', 'enabled': True},
        {'day': '06', 'title': 'Publier', 'sub': 'Tests & Sécurité', 'icon': '', 'image': '', 'status': 'available', 'enabled': True},
        {'day': '07', 'title': 'Lancer', 'sub': 'Utilisateurs & Croissance', 'icon': '', 'image': '', 'status': 'available', 'enabled': True}
    ]
    j['settings'] = {'booking_enabled': False, 'video_url': '', 'privacy_url': '', 'legal_url': '', 'show_program_details': True}
    return j

def load_ebook1():
    p = ROOT / 'templates' / 'ebook1.json'
    j = json.loads(p.read_text('utf-8'))
    j['copy'] = {
        'headline': j['promise']['headline'],
        'subhead': j['promise']['subhead'],
        'social_proof': j['promise']['social_proof'],
        'capture_cta': 'Télécharger le chapitre gratuit',
        'author_bio_title': j['author_story']['greeting'],
        'author_bio_paragraphs': j['author_story']['paragraphs'],
        'author_ps': j['author_story']['ps_note'],
        'thankyou_title': j['steps'][1]['thankyou_title'],
        'thankyou_download_url': j['steps'][1]['download_url'],
        'buy_book_label': j['steps'][1]['buy_cta_label'],
        'buy_book_url': j['steps'][1]['buy_cta_url']
    }
    j['settings'] = {
        'booking_enabled': False,
        'video_url': '',
        'privacy_url': '',
        'legal_url': '',
        'whatsapp_group_title': j['steps'][1]['whatsapp_group_title'],
        'whatsapp_group_link': j['steps'][1]['whatsapp_group_link']
    }
    return j

def serialize_funnel(f: Funnel):
    return {
        'id': f.id,
        'workspace_id': f.workspace_id,
        'name': f.name,
        'slug': f.slug,
        'status': f.status,
        'draft': f.draft,
        'published_version_id': f.published_version_id
    }

@router.get('/api/funnels', summary='Lister les tunnels de vente du workspace')
def list_funnels(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    rows = db.scalars(select(Funnel).where(Funnel.workspace_id == m.workspace_id).order_by(Funnel.created_at.desc())).all()
    return [serialize_funnel(f) for f in rows]

@router.post('/api/funnels', status_code=201, summary='Créer un nouveau tunnel de vente')
def new_funnel(p: FunnelIn, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    if p.template in ('ebook1', 'ebook_1', 'ebook'):
        data = load_ebook1()
        data['copy']['headline'] = p.name
    else:
        data = load_app7()
        data['copy']['title'] = p.name
    f = Funnel(workspace_id=m.workspace_id, name=p.name, slug=slug(p.name) + '-' + secrets.token_hex(4), draft=data)
    db.add(f)
    db.commit()
    return serialize_funnel(f)

@router.get('/api/funnels/{id_}', summary='Consulter les détails d’un tunnel')
def get_funnel(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    return serialize_funnel(f)

@router.patch('/api/funnels/{id_}', summary='Modifier le brouillon d’un tunnel')
def edit_funnel(id_: str, p: PatchFunnel, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    if p.name is not None:
        f.name = p.name.strip()
    if p.draft is not None:
        raw = json.dumps(p.draft, ensure_ascii=False)
        if len(raw) > 120000:
            raise HTTPException(422, 'Document trop volumineux')
        if not isinstance(p.draft.get('copy'), dict) or not isinstance(p.draft.get('brand'), dict):
            raise HTTPException(422, 'Structure du tunnel incorrecte')
        f.draft = p.draft
    db.commit()
    return serialize_funnel(f)

@router.post('/api/funnels/{id_}/publish', summary='Publier la version actuelle d’un tunnel')
def publish(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    next_version = (db.scalar(select(func.max(FunnelVersion.version)).where(FunnelVersion.funnel_id == f.id)) or 0) + 1
    version = FunnelVersion(workspace_id=m.workspace_id, funnel_id=f.id, version=next_version, snapshot=json.loads(json.dumps(f.draft)))
    db.add(version)
    db.flush()
    f.published_version_id = version.id
    f.status = 'published'
    db.commit()
    return {'url': f'/f/{f.slug}', 'version': next_version, 'version_id': version.id}

@router.post('/api/funnels/{id_}/unpublish', summary='Mettre un tunnel hors ligne')
def unpublish(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    f.status = 'draft'
    db.commit()
    return {'ok': True}

@router.post('/api/funnels/{id_}/duplicate', status_code=201, summary='Dupliquer un tunnel de conversion')
def duplicate_funnel(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    orig = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not orig:
        raise HTTPException(404, 'Tunnel introuvable')
    new_name = f"{orig.name} (Copie)"
    new_draft = json.loads(json.dumps(orig.draft))
    if isinstance(new_draft.get('copy'), dict):
        new_draft['copy']['title'] = new_name
    f = Funnel(workspace_id=m.workspace_id, name=new_name, slug=slug(new_name) + '-' + secrets.token_hex(4), draft=new_draft, status='draft')
    db.add(f)
    db.commit()
    return serialize_funnel(f)

@router.delete('/api/funnels/{id_}', summary='Supprimer un tunnel de conversion')
def delete_funnel(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    db.execute(delete(FunnelVersion).where(FunnelVersion.funnel_id == f.id))
    db.delete(f)
    db.commit()
    return {'ok': True, 'deleted_id': id_}
