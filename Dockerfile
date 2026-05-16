# ── Stage 1: Dependencies ────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install only production + build deps
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build argument — injected at build time, NOT baked into client bundle
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build

# ── Stage 3: Production Runner ───────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only what's needed from the standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

# Cloud Run sets PORT=8080 by default
CMD ["node", "server.js"]
