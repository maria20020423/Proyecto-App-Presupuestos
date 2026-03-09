# --- Etapa 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

# Instalamos herramientas de compilación y python para módulos nativos
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

# IMPORTANTE: Para node-firebird-driver-native necesitamos 
# libfbclient2 Y herramientas de compilación para el rebuild de npm
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libfbclient2 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./

# Ahora npm install --omit=dev funcionará porque tiene Python y G++
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]   