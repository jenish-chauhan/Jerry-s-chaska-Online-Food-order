# =============================================================================
# Admin Panel Dockerfile — Multi-stage build (React + Nginx)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Build the React application
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm ci || npm install

# Copy the rest of the source code
COPY . .

# Accept VITE_API_URL as a build argument and expose it to Vite
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Produce the optimised production bundle in /app/dist
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: Serve the static assets with Nginx
# ---------------------------------------------------------------------------
FROM nginx:alpine

# Remove the default Nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom Nginx configuration for SPA routing + API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
