# =============================================================================
# Admin Panel Dockerfile - React + Nginx
# Fix applied:
#   Removed build-time browser config. Runtime values now come from container
#   environment variables so the same image works across environments.
# =============================================================================

# ---------- Stage 1: build the admin app ----------
FROM node:20-alpine AS build

# Set the working directory for dependency install and build output.
WORKDIR /app

# Copy lockfile and manifest first so dependency install can be cached.
COPY package.json package-lock.json ./

# Install the exact locked dependency tree for reliable builds.
RUN npm ci

# Copy the admin panel source code into the container.
COPY . .

# Compile the admin panel into static files in /app/dist.
RUN npm run build

# ---------- Stage 2: serve with Nginx ----------
FROM nginx:alpine

# Remove the default Nginx static files.
RUN rm -rf /usr/share/nginx/html/*

# Copy the admin Nginx configuration with SPA and API proxy rules.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Generate runtime browser config from container environment on startup.
COPY docker-entrypoint.d/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

# Copy the built admin panel from the previous stage.
COPY --from=build /app/dist /usr/share/nginx/html

# Default to the Nginx reverse-proxied backend path.
ENV APP_API_URL=/api

# Expose the internal HTTP port.
EXPOSE 80

# Run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
