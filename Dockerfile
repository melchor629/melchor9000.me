FROM node:24-alpine AS base

FROM base AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --force


FROM base AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN \
  --mount=type=secret,id=FLICKR_API_KEY,env=FLICKR_API_KEY \
  --mount=type=secret,id=FLICKR_SECRET_KEY,env=FLICKR_SECRET_KEY \
  --mount=type=secret,id=FLICKR_USER_ID,env=FLICKR_USER_ID \
  --mount=type=secret,id=LASTFM_API_KEY,env=LASTFM_API_KEY \
  --mount=type=secret,id=LASTFM_SECRET_KEY,env=LASTFM_SECRET_KEY \
  --mount=type=secret,id=IMMICH_API_KEY,env=IMMICH_API_KEY \
  --mount=type=secret,id=IMMICH_URL,env=IMMICH_URL \
  --mount=type=secret,id=BUILD_ID,env=BUILD_ID \
  npm run build


FROM base AS final

WORKDIR /app

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["node", "server.js"]
