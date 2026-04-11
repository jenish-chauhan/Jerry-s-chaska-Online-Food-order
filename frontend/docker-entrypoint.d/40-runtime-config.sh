#!/bin/sh
set -eu

json_escape() {
  printf '%s' "${1:-}" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

API_URL=$(json_escape "${APP_API_URL:-/api}")
ADMIN_URL=$(json_escape "${APP_ADMIN_URL:-http://localhost:8080}")

cat <<EOF >/usr/share/nginx/html/runtime-config.js
window.__APP_CONFIG__ = Object.freeze({
  API_URL: "${API_URL}",
  ADMIN_URL: "${ADMIN_URL}"
});
EOF
