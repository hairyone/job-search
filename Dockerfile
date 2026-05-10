# Multi-stage Dockerfile for Job Application Tracker
# This builds both the React frontend and Node.js backend

FROM node:18-alpine AS builder

# Build the React frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies and code
COPY package*.json ./
RUN npm install --only=production

# Copy backend code
COPY server/ ./server/

# Copy built frontend from builder stage
COPY --from=builder /app/client/build ./client/build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server/index.js"]
