# Jerry's Chaska

Full-stack food ordering system with:

- `frontend` customer app
- `admin-panel` admin dashboard
- `backend` Node.js API
- `mongodb` as the active database

## Stack

- Frontend: React + Vite + Nginx
- Admin Panel: React + Vite + Nginx
- Backend: Node.js + Express + Mongoose
- Database: MongoDB 7
- Deployment: Docker, Docker Compose, Kubernetes

## Run With Docker

From the project root:

```bash
docker compose up --build -d
```

App URLs:

- Frontend: `http://localhost:5173`
- Admin Panel: `http://localhost:8080`
- Backend API: `http://localhost:5000/api`

## Main Folders

```text
project-root/
|-- frontend/
|-- admin-panel/
|-- backend/
|-- k8s/
|-- docker-compose.yml
|-- docker-command-readme.md
`-- README.md
```

## Documentation

- `docker-command-readme.md` - Docker build/run commands
- `k8s/README.md` - Kubernetes setup commands
- `SETUP.md` - project setup notes
- `MIGRATION.md` - migration background
- `TROUBLESHOOTING.md` - common fixes

## Note

Legacy MySQL-only files were removed because the current application uses MongoDB end to end.
