# --- Etapa 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

# Herramientas para compilar módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Runtime ---
FROM node:20-slim
WORKDIR /app

# 1. Instalamos la librería y herramientas necesarias
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libfbclient2 \
    && rm -rf /var/lib/apt/lists/*

# 2. FIX CRUCIAL: Crear el enlace simbólico para libfbclient.so
# Esto resuelve el error "Cannot load Firebird client library"
RUN ln -s /usr/lib/x86_64-linux-gnu/libfbclient.so.2 /usr/lib/x86_64-linux-gnu/libfbclient.so

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]