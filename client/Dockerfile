# Build stage
FROM node:20 AS builder
WORKDIR /app
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

# Runtime stage
FROM node:20-slim
WORKDIR /app
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app .
EXPOSE 3000
CMD ["pnpm", "start"] 
