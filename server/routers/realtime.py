from __future__ import annotations
import json
import asyncio
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Request, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import Session

from ..db import get_db, SessionLocal
from ..models import User, Membership, Booking, Event, now
from ..dependencies import logged_user, tenant

router = APIRouter()

@router.get('/api/realtime/stream', tags=['Système & Santé'], summary='Flux temps réel Server-Sent Events (SSE)')
async def realtime_stream(workspace_id: str, request: Request, db: Session = Depends(get_db), user: User = Depends(logged_user)):
    if not db.scalar(select(Membership.id).where(Membership.workspace_id == workspace_id, Membership.user_id == user.id)):
        raise HTTPException(403, 'Accès temps réel refusé')
    latest = db.scalar(select(Event).where(Event.workspace_id == workspace_id)
                       .order_by(Event.created_at.desc(), Event.id.desc()).limit(1))
    cursor = (latest.created_at, latest.id) if latest else (datetime(1970, 1, 1, tzinfo=timezone.utc), '')
    if cursor[0].tzinfo is None:
        cursor = (cursor[0].replace(tzinfo=timezone.utc), cursor[1])

    async def stream():
        nonlocal cursor
        yield 'event: ready\ndata: {"connected":true}\n\n'
        while not await request.is_disconnected():
            try:
                with SessionLocal() as session:
                    still_member = session.scalar(select(Membership.id).where(
                        Membership.workspace_id == workspace_id, Membership.user_id == user.id))
                    if not still_member:
                        break
                    events = session.scalars(select(Event).where(
                        Event.workspace_id == workspace_id,
                        or_(Event.created_at > cursor[0], and_(Event.created_at == cursor[0], Event.id > cursor[1]))
                    ).order_by(Event.created_at.asc(), Event.id.asc()).limit(100)).all()
                    for e in events:
                        ts = e.created_at
                        if ts.tzinfo is None:
                            ts = ts.replace(tzinfo=timezone.utc)
                        if (ts, e.id) <= cursor:
                            continue
                        cursor = (ts, e.id)
                        yield 'event: changed\ndata: ' + json.dumps({'event_id': e.id, 'type': e.type}, ensure_ascii=False) + '\n\n'
            except Exception:
                yield ': backend temporarily unavailable\n\n'
            yield ': heartbeat\n\n'
            await asyncio.sleep(3)

    return StreamingResponse(stream(), media_type='text/event-stream', headers={'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no'})

@router.get('/api/bookings/{id_}/ics', tags=['Calendrier & Rendez-vous'], summary='Export du rendez-vous au format iCalendar (.ics)')
def booking_ics(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    b = db.scalar(select(Booking).where(Booking.id == id_, Booking.workspace_id == m.workspace_id))
    if not b:
        raise HTTPException(404, 'Rendez-vous introuvable')
    start = datetime.fromisoformat(b.slot).astimezone(timezone.utc)
    end = start + timedelta(minutes=30)
    fmt = lambda d: d.strftime('%Y%m%dT%H%M%SZ')
    body = f'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//NUM Funnel OS//Booking//FR\r\nBEGIN:VEVENT\r\nUID:{b.id}@numfunnel.local\r\nDTSTAMP:{fmt(now())}\r\nDTSTART:{fmt(start)}\r\nDTEND:{fmt(end)}\r\nSUMMARY:Appel découverte\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n'
    return Response(content=body, media_type='text/calendar', headers={'Content-Disposition': 'attachment; filename="rendez-vous.ics"'})
