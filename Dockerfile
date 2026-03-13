# Stage 1: Build
FROM node:20-slim AS build

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

WORKDIR /app

# Best practice: Don't run as root
USER node

# Copy built application from build stage
# Nuxt 4 build output is in .output
COPY --from=build --chown=node:node /app/.output ./.output

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start the server using the standalone Nitro output
CMD ["node", ".output/server/index.mjs"]
