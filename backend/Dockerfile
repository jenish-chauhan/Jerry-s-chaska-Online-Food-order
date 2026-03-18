# =============================================================================
# Backend Dockerfile - Node.js 20 Alpine
# Current stack note:
#   This backend talks to MongoDB, not MySQL. The old MySQL-oriented comments
#   were misleading and have been replaced with the actual runtime variables.
# =============================================================================

# Use a small official Node.js image for the API runtime.
FROM node:20-alpine

# All next commands run from /app inside the container.
WORKDIR /app

# Copy dependency manifests first so Docker can reuse cached install layers
# when only application code changes.
COPY package.json package-lock.json ./

# Install only runtime dependencies. This keeps the image smaller and avoids
# shipping development-only packages like nodemon.
RUN npm ci --omit=dev

# Copy the backend source code that the app needs at runtime.
COPY src/ ./src/

# Runtime environment variables expected by this container:
# - MONGO_URI      MongoDB connection string
# - JWT_SECRET     Secret used to sign auth tokens
# - FRONTEND_URL   Allowed frontend/admin origins for CORS and sockets
# - PORT           Express server port (this app uses 5000 by default)
# - NODE_ENV       Usually "production" in containers

# Document the API port exposed by the container.
EXPOSE 5000

# Create and use a non-root user for safer container execution.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the backend API.
CMD ["node", "src/app.js"]
