FROM node:24-alpine AS development

# 1) Base packages and Chromium + fonts
RUN apk add \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    ca-certificates \
    udev

# 2) Node tooling
RUN npm install -g pnpm
ENV PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chrome

WORKDIR /app/dev

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

FROM node:24-alpine AS staging

# 1) Base packages and Chromium + fonts
RUN apk add \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    ca-certificates \
    udev

# 2) Node tooling
RUN npm install -g pnpm
ENV PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chrome

WORKDIR /app/stag

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

FROM node:24-alpine AS production

# 1) Base packages and Chromium + fonts
RUN apk add \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    ca-certificates \
    udev

# 2) Node tooling
RUN npm install -g pnpm
ENV PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chrome

WORKDIR /app/prod

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build