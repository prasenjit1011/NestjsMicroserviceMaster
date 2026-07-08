# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

COPY prisma ./prisma

# Install all dependencies
RUN npm ci

# Copy project
COPY . .

# Generate Prisma Client
# RUN npx prisma generate
# RUN npm run prisma:generate

# Build NestJS
RUN npm run build

# --------------------------
# Verify build output
# --------------------------
RUN echo "================================="
RUN echo "Contents of /app"
RUN ls -lah

RUN echo "================================="
RUN echo "Contents of dist"
RUN ls -lah dist || true

RUN echo "================================="
RUN echo "Contents of dist/src"
RUN ls -lah dist/src || true

RUN echo "================================="
RUN echo "All compiled files"
RUN find dist -type f

RUN test -f dist/src/main.js

# Remove development dependencies
RUN npm prune --omit=dev

# ==========================
# Runtime Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV GRPC_URL=0.0.0.0:50051

# Copy runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy Prisma (if your application uses it at runtime)
COPY --from=builder /app/prisma ./prisma

# Copy proto files required by gRPC
COPY --from=builder /app/src/proto ./dist/src/proto

# --------------------------
# Verify runtime image
# --------------------------
RUN echo "===== Runtime ====="
RUN pwd

RUN echo "===== dist ====="
RUN ls -lah dist

RUN echo "===== dist/src ====="
RUN ls -lah dist/src

RUN echo "===== Compiled Files ====="
RUN find dist -type f

RUN test -f dist/src/main.js

# gRPC Port
EXPOSE 8080
EXPOSE 50051

CMD ["node", "dist/src/main.js"]