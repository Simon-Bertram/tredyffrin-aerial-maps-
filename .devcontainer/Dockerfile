# --- STAGE 1: BASE ---
# Setup OS and Package Manager (pnpm)
FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm AS base

# Install system deps for native modules (sharp, etc.)
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install -y --no-install-recommends \
    git curl ca-certificates openssl bash-completion \
    python3 make g++ libvips-dev \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Setup pnpm 10.x
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV CI=1

# Ensure node-owned home-local paths exist in all stages
RUN mkdir -p /home/node/.local/share/pnpm/store /home/node/.local/share/better-t-stack \
  && chown -R node:node /home/node/.local

# --- STAGE 2: BUILDER ---
# This stage compiles your code for Cloudflare/Alchemy
FROM base AS builder
WORKDIR /app

# Copy configuration files first (better for caching)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# Install dependencies using a cache mount for speed
RUN --mount=type=cache,id=pnpm,target=/home/node/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# Generate auth schemas and build the project
RUN pnpm exec better-auth generate
RUN pnpm run build

# --- STAGE 3: DEV ---
# This is what you use for local development (Dev Containers)
FROM base AS dev
WORKDIR /workspaces

# Set permissions so the 'node' user can work comfortably
RUN mkdir -p /workspaces && chown -R node:node /workspaces /home/node/.local
USER node

# Install global dev tools
RUN pnpm add -g wrangler@latest tsx@latest
