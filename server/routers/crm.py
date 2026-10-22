from __future__ import annotations
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Membership, Contact, Booking, CalBooking, Event, Submission, Application, now
from ..schemas import ContactPatch
from ..dependencies import tenant

router = APIRouter()

@router.get('/api/contacts', tags=['CRM & Contacts'], summary='Liste des prospects et contacts qualifiés')
def contacts(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    cs = db.scalars(select(Contact).where(Contact.workspace_id == m.workspace_id).order_by(Contact.created_at.desc()).limit(500)).all()
    return [{'id': c.id, 'first_name': c.first_name, 'email': c.email, 'status': c.status, 'source': c.source, 'created_at': c.created_at.isoformat()} for c in cs]

@router.patch('/api/contacts/{id_}', tags=['CRM & Contacts'], summary='Mettre à jour le statut commercial d’un contact')
def contact_status(id_: str, p: ContactPatch, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    if p.status not in ('new', 'contacted', 'qualified', 'booked', 'customer', 'archived'):
        raise HTTPException(422, 'Statut inconnu')
    c = db.scalar(select(Contact).where(Contact.id == id_, Contact.workspace_id == m.workspace_id))
    if not c:
        raise HTTPException(404, 'Contact introuvable')
    c.status = p.status
    db.commit()
    return {'ok': True}

@router.get('/api/bookings', tags=['Calendrier & Rendez-vous'], summary='Liste des rendez-vous confirmés')
def list_bookings(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    bs = db.scalars(select(Booking).where(Booking.workspace_id == m.workspace_id).order_by(Booking.slot.desc())).all()
    cals = db.scalars(select(CalBooking).where(CalBooking.workspace_id == m.workspace_id)).all()
    local = [{'id': b.id, 'slot': b.slot, 'status': b.status, 'provider': 'interne', 'contact': db.get(Contact, b.contact_id).email if db.get(Contact, b.contact_id) else '?'} for b in bs]
    external = [{'id': b.id, 'slot': b.slot, 'status': b.status, 'provider': 'calcom', 'contact': db.get(Contact, b.contact_id).email if db.get(Contact, b.contact_id) else '?'} for b in cals]
    return sorted(local + external, key=lambda b: b['slot'], reverse=True)

@router.get('/api/events', tags=['Analyses & Attribution'], summary='Journal des événements de conversion')
def list_events(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    rows = db.scalars(select(Event).where(Event.workspace_id == m.workspace_id).order_by(Event.created_at.desc()).limit(150)).all()
    return [{'id': e.id, 'type': e.type, 'created_at': e.created_at.isoformat(), 'data': e.data, 'funnel_id': e.funnel_id} for e in rows]

@router.get('/api/analytics', tags=['Analyses & Attribution'], summary='Indicateurs et KPIs de conversion')
def analytics(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    wid = m.workspace_id
    total = lambda model: db.scalar(select(func.count()).select_from(model).where(model.workspace_id == wid)) or 0
    leads = total(Contact)
    appointments = total(Booking)
    forms = total(Submission)
    interests = total(Application)
    return {
        'contacts': leads,
        'submissions': forms,
        'applications': interests,
        'bookings': appointments,
        'conversion_to_booking': round(appointments * 100 / leads, 1) if leads else 0,
        'event_count': total(Event),
        'revenue': None,
        'ad_spend': None
    }

@router.get('/api/analytics/timeseries', tags=['Analyses & Attribution'], summary='Séries temporelles d’activité (14 jours)')
def timeseries(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    start = (now() - timedelta(days=13)).date()
    data = [{'date': (start + timedelta(days=i)).isoformat(), 'leads': 0, 'applications': 0, 'bookings': 0} for i in range(14)]
    rows = db.scalars(select(Event).where(Event.workspace_id == m.workspace_id, Event.created_at >= datetime.combine(start, datetime.min.time()).replace(tzinfo=timezone.utc))).all()
    idx = {r['date']: r for r in data}
    for e in rows:
        day = e.created_at.date().isoformat()
        if day in idx:
            field = {'lead_created': 'leads', 'application_interest_submitted': 'applications', 'appointment_scheduled': 'bookings'}.get(e.type)
            if field:
                idx[day][field] += 1
    return {'days': data, 'source': 'internal_events'}
