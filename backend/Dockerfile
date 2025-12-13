# backend/Dockerfile

# Stage 1: Build Image
FROM node:22-alpine AS build

WORKDIR /app
RUN npm install -g pnpm 

# ------------------------------------------------------------------
# AANPASSING 1: Kopieer ALLE benodigde root configuratiebestanden
# NestJS heeft deze nodig om te weten waar de broncode en modules staan
# ------------------------------------------------------------------
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json nest-cli.json ./ 

RUN pnpm install --frozen-lockfile 

# Kopieer de rest van de broncode (alleen src is nodig voor dev container, maar we kopiëren alles)
COPY . .

# Build de NestJS app
RUN pnpm run build 

# ----------------------------------------------------
# Stage 2: Production Image (blijft hetzelfde, want de build werkt)
# ...