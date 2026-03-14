# Stage 1: Build
FROM node:20-slim AS build

# Build-time arguments (Public variables needed by Nuxt)
ARG NUXT_PUBLIC_VICKET_API_URL
ENV NUXT_PUBLIC_VICKET_API_URL=$NUXT_PUBLIC_VICKET_API_URL

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Build Nuxt 4 application
RUN pnpm run build

# Stage 2: Runtime
FROM node:20-slim AS runtime

LABEL org.opencontainers.image.source="https://github.com/Q300Z/exemple-vicket-nuxt"

WORKDIR /app

# Best practice: Don't run as root
USER node

# Copy built application from build stage
COPY --from=build --chown=node:node /app/.output ./.output

# Set default runtime environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start the server
CMD ["node", ".output/server/index.mjs"]
