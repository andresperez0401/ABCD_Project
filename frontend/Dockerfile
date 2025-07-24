# # frontend/Dockerfile
# # Etapa de build
# FROM node:20-alpine as build

# WORKDIR /app

# COPY package.json package-lock.json* ./
# RUN npm install

# COPY . .
# RUN npm run build

# # Etapa de producción con NGINX
# FROM nginx:stable-alpine

# # Copia tu build al directorio que sirve nginx
# COPY --from=build /app/dist /usr/share/nginx/html

# # Opcional: copia un nginx.conf custom si necesitas history API fallback
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]











# Usa la imagen base de Node.js
# 1. Usa una imagen ligera de Node.js
FROM node:20-alpine

# 2. Crea y entra en el directorio de trabajo
WORKDIR /app

# 3. Copia sólo los archivos de dependencias y lockfile
COPY package.json package-lock.json ./

# 4. Instala EXACTAMENTE lo del lockfile (más rápido y reproducible)
RUN npm ci

# 5. Copia el resto de tu código
COPY . .

# 6. Expone el puerto que usa Vite en dev mode
EXPOSE 3000

# 7. Comando por defecto: arranca Vite en modo dev
CMD ["npm", "run", "dev"]

