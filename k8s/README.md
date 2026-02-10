# Kubernetes Manifests — Jerry's Chaska

This directory contains Kubernetes manifests to deploy the full 3-tier Jerry's Chaska application (Frontend, Backend, MySQL).

## 📁 File Overview

| File | Kind | Description |
| :--- | :--- | :--- |
| `frontend-deployment.yml` | Deployment | 2 replicas of the React SPA served by Nginx on port **80** |
| `frontend-service.yml` | Service (LoadBalancer) | Exposes the frontend to external traffic on port **80** |
| `backend-deployment.yml` | Deployment | 2 replicas of the Node.js Express API on port **5000** |
| `backend-service.yml` | Service (ClusterIP) | Internal service for backend on port **5000** |
| `mysql-deployment.yml` | Deployment | 1 replica of MySQL 8.0 on port **3306** |
| `mysql-service.yml` | Service (ClusterIP) | Internal service for MySQL on port **3306** |

## 🔗 How Containers Communicate

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │────────▶│   Backend    │────────▶│    MySQL     │
│  (Nginx:80)  │  HTTP   │ (Node:5000)  │   TCP   │   (:3306)    │
│              │         │              │         │              │
│  Service:    │         │  Service:    │         │  Service:    │
│  frontend    │         │  backend     │         │  mysql       │
│  (LB / NP)  │         │  (ClusterIP) │         │  (ClusterIP) │
└──────────────┘         └──────────────┘         └──────────────┘
```

- **Frontend → Backend**: The React app calls the API at `/api` (configured via `VITE_API_BASE_URL`). In Kubernetes, an Ingress (added later) will route `/api` requests to the `backend` Service.
- **Backend → MySQL**: The Express app connects to `DB_HOST=mysql` which resolves via Kubernetes DNS to the `mysql` ClusterIP Service.
- **External Users → Frontend**: Users access the app through the `frontend` LoadBalancer Service (or NodePort on Minikube).

> **Key concept**: In Kubernetes, service DNS names (`backend`, `mysql`) replace `localhost`. Each Service gets a stable DNS entry like `<service-name>.<namespace>.svc.cluster.local`.

## 🚀 Deploy Commands

### Apply all manifests at once

```bash
kubectl apply -f k8s/
```

### Or apply individually (in order)

```bash
# 1. MySQL first (backend depends on it)
kubectl apply -f k8s/mysql-deployment.yml
kubectl apply -f k8s/mysql-service.yml

# 2. Backend next (frontend depends on it)
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml

# 3. Frontend last
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
```

### Check status

```bash
# View all pods
kubectl get pods

# View all services
kubectl get svc

# View logs for a specific pod
kubectl logs <pod-name>

# Describe a pod for debugging
kubectl describe pod <pod-name>
```

### Access the application

**On EKS / cloud clusters:**
```bash
# Get the external IP of the frontend LoadBalancer
kubectl get svc frontend
# Open the EXTERNAL-IP in your browser
```

**On Minikube:**
```bash
# Change frontend-service.yml type to NodePort, then:
minikube service frontend
```

## ⚠️ Important Notes

- **Replace image placeholders**: Update `<your-dockerhub-username>` in all deployment files with your actual Docker Hub username or container registry path.
- **Secrets**: The environment variables in the deployment files contain placeholder passwords. In production, use Kubernetes Secrets instead of plain-text values.
- **Persistent storage**: The MySQL deployment uses `emptyDir` by default (data is lost on pod restart). For production, switch to a PersistentVolumeClaim.
- **No Ingress yet**: Ingress will be added in a future step to route `/api` to the backend and `/` to the frontend under a single domain.
- **No Docker Compose**: This project uses Kubernetes as the target runtime. Docker Compose is intentionally not included.
