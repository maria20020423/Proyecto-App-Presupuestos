# ---------- BUILD ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- RUNTIME ----------
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libfbclient2 \
    libstdc++6 \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/lib/x86_64-linux-gnu/libfbclient.so.2 /usr/lib/x86_64-linux-gnu/libfbclient.so

ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node","dist/index.js"]