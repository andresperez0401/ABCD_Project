# ---------- Build del frontend ----------
FROM node:20-alpine AS fe
WORKDIR /app
COPY frontend/package*.json frontend/
# usa npm install por si no hay package-lock en /frontend
RUN cd frontend && npm install
COPY frontend frontend
RUN cd frontend && npm run build

# ---------- Runtime del backend ----------
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc \
  && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend backend

# 👇 <— AQUÍ el cambio clave a 'dist'
COPY --from=fe /app/frontend/dist ./backend/static

WORKDIR /app/backend
EXPOSE 5000
# CMD ["gunicorn","-w","3","-b","0.0.0.0:5000","app:app"]
CMD gunicorn -w 2 -b 0.0.0.0:$PORT app:app