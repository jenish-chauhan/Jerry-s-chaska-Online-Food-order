# =============================================================================
# Backend Dockerfile — Node.js 20 Alpine (production-ready)
# Produces a minimal image suitable for Kubernetes deployment.
# =============================================================================

FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
COPY package.json package-lock.json ./

# Install only production dependencies (skip devDependencies like nodemon)
RUN npm ci --only=production

# Copy the application source code
COPY src/ ./src/

# ---------------------------------------------------------------------------
# Environment variables — injected at runtime via Kubernetes Secrets / ConfigMaps
# ---------------------------------------------------------------------------
# DB_HOST   — MySQL service DNS name in Kubernetes (e.g. "mysql" or "jerrys-mysql")
# DB_PORT   — MySQL port (default 3306)
# DB_USER   — MySQL user
# DB_PASSWORD — MySQL password
# DB_NAME   — Database name (default "jerrys_chaska")
# JWT_SECRET — Secret key for JWT token signing
# FRONTEND_URL — Allowed CORS origin (e.g. "http://jerrys-frontend" or Ingress URL)
# PORT      — Port the Express server listens on (default 3000)
# NODE_ENV  — "production" in Kubernetes

# Expose the backend API port
# The actual port is controlled by the PORT environment variable (default 3000).
# In Kubernetes, set PORT=5000 via the Deployment manifest.
EXPOSE 5000

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the Express server
CMD ["node", "src/app.js"]
