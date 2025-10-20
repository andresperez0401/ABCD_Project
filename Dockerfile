# ---------- Build del frontend ----------
FROM node:20-alpine AS fe
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci
COPY frontend frontend
RUN cd frontend && npm run build

# ---------- Runtime del backend ----------
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Herramientas para compilar deps nativas (psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc \
  && rm -rf /var/lib/apt/lists/*

# Instala dependencias Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el backend
COPY backend backend

# Copia el build del frontend a /backend/static
COPY --from=fe /app/frontend/build ./backend/static

WORKDIR /app/backend
EXPOSE 5000

# Gunicorn para producción
CMD ["gunicorn", "-w", "3", "-b", "0.0.0.0:5000", "app:app"]
