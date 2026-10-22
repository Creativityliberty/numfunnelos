FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY server/requirements.txt /app/server/requirements.txt
RUN pip install --no-cache-dir -r /app/server/requirements.txt
COPY server /app/server
COPY web /app/web
COPY templates /app/templates
COPY tests /app/tests
COPY pytest.ini /app/pytest.ini
RUN useradd -r -u 10001 -s /usr/sbin/nologin appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8080
CMD ["uvicorn","server.main:app","--host","0.0.0.0","--port","8080","--proxy-headers","--forwarded-allow-ips","*"]
