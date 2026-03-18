# Kubernetes Setup

This folder contains a working Kubernetes setup for the current application stack:

- `mongodb`
- `backend`
- `frontend`
- `admin-panel`

The image names match the ones used in the root `docker-command-readme.md`:

- `food-ordering-backend:latest`
- `food-ordering-frontend:latest`
- `food-ordering-admin:latest`
- `mongo:7`

## Files

- `namespace.yml`
- `app-secret.yml`
- `backend-config.yml`
- `mongodb-pvc.yml`
- `mongodb-deployment.yml`
- `mongodb-service.yml`
- `backend-deployment.yml`
- `backend-service.yml`
- `frontend-deployment.yml`
- `frontend-service.yml`
- `admin-panel-deployment.yml`
- `admin-panel-service.yml`

## 1. Build Docker Images

Run these from the project root:

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

docker build -t food-ordering-backend:latest .\backend
docker build `
  --build-arg VITE_API_URL=/api `
  --build-arg VITE_ADMIN_URL=http://localhost:30081 `
  -t food-ordering-frontend:latest `
  .\frontend
docker build `
  --build-arg VITE_API_URL=/api `
  -t food-ordering-admin:latest `
  .\admin-panel
docker pull mongo:7
```

## 2. Make Images Available To Kubernetes

Use the option that matches your local cluster.

### Option A: Minikube

```powershell
minikube image load food-ordering-backend:latest
minikube image load food-ordering-frontend:latest
minikube image load food-ordering-admin:latest
minikube image load mongo:7
```

### Option B: kind

```powershell
kind load docker-image food-ordering-backend:latest
kind load docker-image food-ordering-frontend:latest
kind load docker-image food-ordering-admin:latest
kind load docker-image mongo:7
```

### Option C: Docker Desktop Kubernetes

If Docker Desktop Kubernetes is enabled, the local Docker images are usually available directly.

## 3. Apply All Kubernetes Files

Run:

```powershell
kubectl apply -f .\k8s\namespace.yml
kubectl apply -f .\k8s\app-secret.yml
kubectl apply -f .\k8s\backend-config.yml
kubectl apply -f .\k8s\mongodb-pvc.yml
kubectl apply -f .\k8s\mongodb-deployment.yml
kubectl apply -f .\k8s\mongodb-service.yml
kubectl apply -f .\k8s\backend-deployment.yml
kubectl apply -f .\k8s\backend-service.yml
kubectl apply -f .\k8s\frontend-deployment.yml
kubectl apply -f .\k8s\frontend-service.yml
kubectl apply -f .\k8s\admin-panel-deployment.yml
kubectl apply -f .\k8s\admin-panel-service.yml
```

Or apply the whole folder after the namespace exists:

```powershell
kubectl apply -f .\k8s
```

## 4. Check Status

```powershell
kubectl get all -n food-ordering
kubectl get pods -n food-ordering
kubectl get svc -n food-ordering
```

If something is not starting:

```powershell
kubectl describe pod -n food-ordering <pod-name>
kubectl logs -n food-ordering deployment/mongodb
kubectl logs -n food-ordering deployment/backend
kubectl logs -n food-ordering deployment/frontend
kubectl logs -n food-ordering deployment/admin-panel
```

## 5. Access The Application

This setup uses `NodePort` for the UI services:

- Frontend: `http://localhost:30080`
- Admin Panel: `http://localhost:30081`

Backend is available inside the cluster through the `backend` service on port `5000`.

For local API testing, use port-forward:

```powershell
kubectl port-forward -n food-ordering svc/backend 5000:5000
```

Then open:

- Backend health: `http://localhost:5000/health`
- Backend API: `http://localhost:5000/api/menu`

## 6. Connectivity Map

- `frontend` -> `backend:5000`
- `admin-panel` -> `backend:5000`
- `backend` -> `mongodb:27017`

The service names in the manifests are intentionally:

- `frontend`
- `admin-panel`
- `backend`
- `mongodb`

This matches the internal hostnames expected by the Nginx configs and backend environment variables.

## 7. Important Note About MongoDB Storage

MongoDB now uses a `PersistentVolumeClaim` named `mongodb-pvc` so data survives pod recreation as long as the PVC remains available.

## 8. Delete Everything

```powershell
kubectl delete namespace food-ordering
```
