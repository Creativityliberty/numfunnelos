# --- Étape 1 : dépendances du service WhatsApp (Baileys, Node) ---
FROM node:20-slim AS whatsapp-deps
WORKDIR /wa
COPY services/whatsapp/package*.json ./
RUN npm ci --omit=dev

# --- Étape 2 : application FastAPI + service WhatsApp embarqué ---
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY server/requirements.txt /app/server/requirements.txt
RUN pip install --no-cache-dir -r /app/server/requirements.txt
COPY --from=whatsapp-deps /usr/local/bin/node /usr/local/bin/node
COPY --from=whatsapp-deps /wa/node_modules /app/services/whatsapp/node_modules
COPY services/whatsapp/package.json services/whatsapp/server.js /app/services/whatsapp/
COPY server /app/server
COPY web /app/web
COPY templates /app/templates
COPY tests /app/tests
COPY pytest.ini /app/pytest.ini
RUN useradd -r -u 10001 -s /usr/sbin/nologin appuser \
    && mkdir -p /app/services/whatsapp/sessions \
    && chown -R appuser:appuser /app
USER appuser
EXPOSE 8080
CMD ["uvicorn","server.main:app","--host","0.0.0.0","--port","8080","--proxy-headers","--forwarded-allow-ips","*"]
