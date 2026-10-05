# Multi-stage Dockerfile for RevenueShield Monorepo
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace manifests
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/database/package*.json ./packages/database/
COPY packages/razorpay/package*.json ./packages/razorpay/
COPY packages/safety/package*.json ./packages/safety/
COPY packages/ai/package*.json ./packages/ai/
COPY packages/agents/package*.json ./packages/agents/
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm install

# Copy entire source
COPY . .

# Generate Prisma client and build all workspaces
ENV NODE_ENV=production
RUN npm run db:generate
RUN npm --workspaces run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy built app from builder
COPY --from=builder /app ./

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push --schema=packages/database/prisma/schema.prisma && npm run start"]
