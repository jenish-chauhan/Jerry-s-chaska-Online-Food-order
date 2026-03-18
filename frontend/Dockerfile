# =============================================================================
# Frontend Dockerfile — Multi-stage build (React + Nginx)
# Produces a lightweight, production-ready image for Kubernetes deployment.
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Build the React application
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build-time environment variables can be injected via --build-arg.
# Example:
#   docker build --build-arg VITE_API_URL=http://backend:3000/api ./frontend
#
# In Kubernetes the API URL will point to the backend Service DNS name
# (e.g. http://jerrys-backend:3000/api) or an Ingress path.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

ARG VITE_ADMIN_URL=http://localhost:8080
ENV VITE_ADMIN_URL=${VITE_ADMIN_URL}

# Produce the optimised production bundle in /app/dist
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: Serve the static assets with Nginx
# ---------------------------------------------------------------------------
FROM nginx:alpine

# Remove the default Nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (the standard HTTP port Nginx listens on)
EXPOSE 80

# Start Nginx in the foreground so the container stays alive
CMD ["nginx", "-g", "daemon off;"]
