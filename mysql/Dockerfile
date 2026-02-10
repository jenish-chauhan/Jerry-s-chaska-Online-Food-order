# =============================================================================
# MySQL Dockerfile — Educational / Learning Purpose
# =============================================================================
#
# NOTE FOR PRODUCTION:
#   In a real production Kubernetes cluster you would typically use the official
#   mysql:8.0 image directly (or a managed database service like AWS RDS,
#   Google Cloud SQL, Azure Database for MySQL) without a custom Dockerfile.
#   This custom Dockerfile exists purely for learning and to demonstrate how
#   an init script can bootstrap the schema automatically.
#
# CREDENTIALS:
#   MySQL root password and application credentials are NOT hardcoded here.
#   They MUST be injected at runtime via Kubernetes Secrets as environment
#   variables:
#     - MYSQL_ROOT_PASSWORD
#     - MYSQL_DATABASE
#     - MYSQL_USER       (optional — app-specific user)
#     - MYSQL_PASSWORD    (optional — app-specific user password)
#
# =============================================================================

FROM mysql:8.0

# Copy the initialisation SQL script into the Docker entrypoint directory.
# Any .sql or .sh files placed here are executed automatically (in alphabetical
# order) the FIRST time the container starts with an empty data directory.
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default MySQL port
EXPOSE 3306
