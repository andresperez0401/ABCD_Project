# backend/Dockerfile
# FROM python:3.13-slim-bookworm

# # Actualiza los paquetes del sistema para aplicar parches de seguridad
# RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends -y ca-certificates && apt-get clean && rm -rf /var/lib/apt/lists/*

# # 1. Variables de entorno para Python
# ENV PYTHONDONTWRITEBYTECODE=1 \
#     PYTHONUNBUFFERED=1

# WORKDIR /app

# # 2. Copiamos requirements e instalamos
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # 3. Copiamos el resto del código
# COPY . .

# # 4. Creamos la carpeta para la DB (SQLite) si usas local,
# #    o espera que tengas DATABASE_URL apuntando a Postgres
# RUN mkdir -p sqlite

# # 5. Exponemos el puerto
# EXPOSE 8080

# # 6. Comando por defecto
# CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]






# backend/Dockerfile

# 1. Partimos de una imagen ligera de Python 3.13
FROM python:3.13-slim

# 2. Variables para que Python no bufferice y pip no guarde caché
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    FLASK_APP=app.py \
    FLASK_ENV=development

# 3. Creamos el directorio de trabajo
WORKDIR /app

# 4. Copiamos el requirements.txt y lo instalamos
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 5. Ahora copiamos el resto de tu aplicación
COPY . /app/

# 6. Exponemos el puerto que usarás (5000)
EXPOSE 5000

# 7. Comando por defecto para arrancar Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]




