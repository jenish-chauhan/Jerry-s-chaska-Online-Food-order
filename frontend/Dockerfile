# =============================================================================
# Frontend Dockerfile - React + Nginx
# Current stack note:
#   The frontend build uses Vite build arguments and the final container serves
#   the static app through Nginx with API/socket proxy rules from nginx.conf.
# =============================================================================

# ---------- Stage 1: build the React app ----------
# Use Node.js only for compiling the production bundle.
FROM node:20-alpine AS build

# Set the working directory for the build stage.
WORKDIR /app

# Copy dependency manifests first to improve Docker layer caching.
COPY package.json package-lock.json ./

# Install all dependencies needed for the production build.
RUN npm ci

# Copy the full frontend source into the build container.
COPY . .

# Vite reads these values at build time, not at runtime.
# VITE_API_URL is usually /api because Nginx proxies API requests to backend.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL} s

# VITE_ADMIN_URL is used when the customer app redirects to the admin panel.
ARG VITE_ADMIN_URL=http://localhost:8080
ENV VITE_ADMIN_URL=${VITE_ADMIN_URL}

# Generate the static production files in /app/dist.
RUN npm run build

# ---------- Stage 2: serve with Nginx ----------
# Use a lightweight web server image for the final runtime container.
FROM nginx:alpine

# Remove the default Nginx welcome page content.
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom SPA + proxy configuration.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend files from the build stage.
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container.
EXPOSE 80

# Keep Nginx in the foreground so the container stays alive.
CMD ["nginx", "-g", "daemon off;"]
