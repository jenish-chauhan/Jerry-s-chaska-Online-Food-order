# =============================================================================
# Admin Panel Dockerfile - React + Nginx
# Fix applied:
#   Removed the fallback `npm install`. Using only `npm ci` keeps builds
#   deterministic and fails fast when package.json and package-lock.json drift.
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

# Vite reads API settings during the build step.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Compile the admin panel into static files in /app/dist.
RUN npm run build

# ---------- Stage 2: serve with Nginx ----------
FROM nginx:alpine

# Remove the default Nginx static files.
RUN rm -rf /usr/share/nginx/html/*

# Copy the admin Nginx configuration with SPA and API proxy rules.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built admin panel from the previous stage.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the internal HTTP port.
EXPOSE 80

# Run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
