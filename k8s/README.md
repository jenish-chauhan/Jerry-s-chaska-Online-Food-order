# Kubernetes Setup

This folder contains the Kubernetes manifests for:

- `mongodb`
- `backend`
- `frontend`
- `admin-panel`

## Important Change

The frontend and admin images no longer need Docker `--build-arg` values.
Both apps now read browser config at container startup from the `web-config`
ConfigMap, so the same image can be reused across Docker, Minikube, Docker Hub,
and Kubernetes environments.

## Files

- `namespace.yml`
- `app-secret.yml`
- `backend-config.yml`
- `web-config.yml`
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
docker build -t food-ordering-frontend:latest .\frontend
docker build -t food-ordering-admin:latest .\admin-panel
docker pull mongo:7
```

## 2. Make Images Available To Kubernetes

### Minikube

```powershell
minikube image load food-ordering-backend:latest
minikube image load food-ordering-frontend:latest
minikube image load food-ordering-admin:latest
minikube image load mongo:7
```

If you reused the same image tag:

```powershell
kubectl rollout restart deployment/backend -n food-ordering
kubectl rollout restart deployment/frontend -n food-ordering
kubectl rollout restart deployment/admin-panel -n food-ordering
```

### kind

```powershell
kind load docker-image food-ordering-backend:latest
kind load docker-image food-ordering-frontend:latest
kind load docker-image food-ordering-admin:latest
kind load docker-image mongo:7
```

### Docker Desktop Kubernetes

Local Docker images are usually available directly.

## 3. Configure The Public Browser URLs

The `web-config` ConfigMap controls the runtime browser settings:

- `APP_API_URL=/api`
- `APP_ADMIN_URL=http://localhost:30081`

Default local port-forward setup already matches the checked-in file:

```powershell
kubectl apply -f .\k8s\web-config.yml
```

If you want to use Minikube NodePort directly instead of port-forwarding, update
`APP_ADMIN_URL` to your real public admin URL before applying:

```powershell
minikube ip
```

Then edit `k8s\web-config.yml` and change:

```yaml
APP_ADMIN_URL: http://<MINIKUBE_IP>:30081
```

## 4. Apply Kubernetes Files

```powershell
kubectl apply -f .\k8s\namespace.yml
kubectl apply -f .\k8s\app-secret.yml
kubectl apply -f .\k8s\backend-config.yml
kubectl apply -f .\k8s\web-config.yml
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

Or after the namespace exists:

```powershell
kubectl apply -f .\k8s
```

## 5. Check Status

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

## 6. Access The Application

### Option A: Port-forward

```powershell
kubectl port-forward -n food-ordering svc/frontend 30080:80
kubectl port-forward -n food-ordering svc/admin-panel 30081:80
```

Open:

- Frontend: `http://localhost:30080`
- Admin Panel: `http://localhost:30081`

### Option B: Minikube NodePort

```powershell
minikube ip
```

Open:

- Frontend: `http://<MINIKUBE_IP>:30080`
- Admin Panel: `http://<MINIKUBE_IP>:30081`

For backend API testing:

```powershell
kubectl port-forward -n food-ordering svc/backend 5000:5000
```

Then:

- Health: `http://localhost:5000/health`
- API: `http://localhost:5000/api/menu`

## 7. Changing The Admin Redirect Later

You no longer need to rebuild the frontend image just to change the admin URL.
Update the ConfigMap and restart the frontend deployment:

```powershell
kubectl apply -f .\k8s\web-config.yml
kubectl rollout restart deployment/frontend -n food-ordering
```

If the browser still uses the old value, hard refresh once so cached files are
not reused.

## 8. Connectivity Map

- `frontend` -> `backend:5000`
- `admin-panel` -> `backend:5000`
- `backend` -> `mongodb:27017`

## 9. Delete Everything

```powershell
kubectl delete namespace food-ordering
```
