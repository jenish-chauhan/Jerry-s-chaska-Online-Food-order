# EC2 Production Deployment Guide

This guide is for deploying the current application on an EC2 instance with Kubernetes.

The current application stack is:

- `frontend`
- `admin-panel`
- `backend`
- `mongodb`

## What To Keep In Mind

Before you build and push images to Docker Hub, keep these points in mind:

1. Build one reusable frontend image and set the public admin URL at runtime.
   The customer frontend now reads `APP_ADMIN_URL` from Kubernetes `web-config`.

2. Keep `APP_API_URL=/api` for both frontend apps.
   Do not hardcode the backend public URL in the frontend image when using the current Nginx proxy setup.
   The frontend and admin panel already proxy `/api` internally to the Kubernetes `backend` service.

3. Do not expose MongoDB publicly.
   Keep MongoDB internal to Kubernetes only.

4. Do not expose backend publicly unless you really need direct API access.
   With the current design, frontend and admin-panel talk to backend through Kubernetes service discovery.

5. Set `FRONTEND_URL` in the backend ConfigMap to the real browser hostnames.
   For EC2/KIND, prefer host-only values such as `<EC2_PUBLIC_IP>` and your EC2
   public DNS name instead of locking CORS to one exact port.

6. Use strong production secrets.
   Replace demo secrets before deployment.

7. Use persistent storage for MongoDB.
   The Kubernetes setup now includes `k8s/mongodb-pvc.yml`.

8. Open only the ports you need in the EC2 security group.
   Recommended:
   - `22` for SSH, ideally only from your IP
   - `30080` for frontend
   - `30081` for admin-panel
     Optional later:
   - `80` and `443` if you add an Ingress or reverse proxy

9. Tag images with explicit versions.
   Prefer `v1`, `v1.0.1`, or release tags instead of relying only on `latest`.

## Recommended EC2 Setup

This guide assumes:

- Ubuntu EC2 instance
- A single-node Kubernetes setup with `k3s`
- Images stored in Docker Hub

## 1. Connect To EC2

From your local machine:

```bash
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

## 2. Install k3s On EC2

Run on the EC2 instance:

```bash
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes
```

Make kubectl easier to use:

```bash
mkdir -p $HOME/.kube
sudo cp /etc/rancher/k3s/k3s.yaml $HOME/.kube/config
sudo chown $USER:$USER $HOME/.kube/config
export KUBECONFIG=$HOME/.kube/config
kubectl get nodes
```

## 3. Install Docker Only If You Want To Build On EC2

If you build images on your own machine and push them to Docker Hub, you can skip this section.

If you want to build directly on EC2:

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
docker --version
```

## 4. Clone The Project On EC2

```bash
git clone <YOUR_REPO_URL>
cd FOOD-ORDERING-SYS
```

## 5. Login To Docker Hub

```bash
docker login
```

## 6. Build Production Images

Replace:

- `<DOCKERHUB_USERNAME>` with your Docker Hub username
- `<EC2_PUBLIC_IP>` with your real EC2 public IP or domain
- `<TAG>` with a real version such as `v1`

### Backend

```bash
docker build -t <DOCKERHUB_USERNAME>/food-ordering-backend:<TAG> ./backend
```

### Frontend

Use `/api` so Nginx proxies requests to the internal `backend` Kubernetes service.

```bash
docker build -t <DOCKERHUB_USERNAME>/food-ordering-frontend:<TAG> ./frontend
```

### Admin Panel

```bash
docker build -t <DOCKERHUB_USERNAME>/food-ordering-admin:<TAG> ./admin-panel
```

## 7. Push Images To Docker Hub

```bash
docker push <DOCKERHUB_USERNAME>/food-ordering-backend:<TAG>
docker push <DOCKERHUB_USERNAME>/food-ordering-frontend:<TAG>
docker push <DOCKERHUB_USERNAME>/food-ordering-admin:<TAG>
```

## 8. Prepare Kubernetes Secrets

Do not use weak demo values in production.

Create the namespace:

```bash
kubectl apply -f k8s/namespace.yml
```

Create the secret from the command line:

```bash
kubectl create secret generic food-ordering-secret \
  -n food-ordering \
  --from-literal=mongo-root-username=admin \
  --from-literal=mongo-root-password='<STRONG_MONGO_PASSWORD>' \
  --from-literal=jwt-secret='<STRONG_JWT_SECRET>' \
  --from-literal=admin-email='<ADMIN_EMAIL>' \
  --from-literal=admin-password='<STRONG_ADMIN_PASSWORD>' \
  --from-literal=admin-name='<ADMIN_NAME>' \
  --dry-run=client -o yaml | kubectl apply -f -
```

## 9. Apply Kubernetes Files

Apply the config and workloads:

```bash
kubectl apply -f k8s/backend-config.yml
kubectl apply -f k8s/web-config.yml
kubectl apply -f k8s/mongodb-pvc.yml
kubectl apply -f k8s/mongodb-deployment.yml
kubectl apply -f k8s/mongodb-service.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
kubectl apply -f k8s/admin-panel-deployment.yml
kubectl apply -f k8s/admin-panel-service.yml
```

## 10. Point Kubernetes Deployments To Docker Hub Images

The current manifests use local image names for development.
For EC2, update them to your Docker Hub images:

```bash
kubectl set image deployment/backend \
  backend=<DOCKERHUB_USERNAME>/food-ordering-backend:<TAG> \
  -n food-ordering

kubectl set image deployment/frontend \
  frontend=<DOCKERHUB_USERNAME>/food-ordering-frontend:<TAG> \
  -n food-ordering

kubectl set image deployment/admin-panel \
  admin-panel=<DOCKERHUB_USERNAME>/food-ordering-admin:<TAG> \
  -n food-ordering
```

Wait for rollout:

```bash
kubectl rollout status deployment/mongodb -n food-ordering
kubectl rollout status deployment/backend -n food-ordering
kubectl rollout status deployment/frontend -n food-ordering
kubectl rollout status deployment/admin-panel -n food-ordering
```

If your public EC2 address is different from the default checked into
`k8s/web-config.yml`, update that file first:

```yaml
APP_API_URL: /api
APP_ADMIN_URL: http://<EC2_PUBLIC_IP>:30081
```

If your browser will open the app through a different EC2 IP, DNS name, or
HTTPS front door than the default checked into `k8s/backend-config.yml`, update
that file too:

```yaml
FRONTEND_URL: "127.0.0.1,localhost,<EC2_PUBLIC_IP>,<EC2_PUBLIC_DNS>"
```

Then apply it again and restart the frontend deployment if needed:

```bash
kubectl apply -f k8s/web-config.yml
kubectl rollout restart deployment/frontend -n food-ordering
```

If you changed `FRONTEND_URL`, restart the backend so the new CORS allowlist is
loaded into the container environment:

```bash
kubectl apply -f k8s/backend-config.yml
kubectl rollout restart deployment/backend -n food-ordering
```

## 11. Verify Connectivity

Check pods and services:

```bash
kubectl get pods -n food-ordering
kubectl get svc -n food-ordering
```

Check backend logs:

```bash
kubectl logs -n food-ordering deployment/backend
```

Check MongoDB logs:

```bash
kubectl logs -n food-ordering deployment/mongodb
```

Test backend health from EC2:

```bash
kubectl port-forward -n food-ordering svc/backend 5000:5000
```

Then in another shell:

```bash
curl http://127.0.0.1:5000/health
curl http://127.0.0.1:5000/api/menu
```

## 12. Access The Application

With the current NodePort services:

- Frontend: `http://<EC2_PUBLIC_IP>:30080`
- Admin Panel: `http://<EC2_PUBLIC_IP>:30081`

## How Components Stay Connected

The current setup is already wired correctly:

- `frontend` -> proxies `/api` and `/socket.io` to `backend:5000`
- `admin-panel` -> proxies `/api` and `/socket.io` to `backend:5000`
- `backend` -> connects to `mongodb:27017`

This works because Kubernetes service names are:

- `frontend`
- `admin-panel`
- `backend`
- `mongodb`

Do not change these names unless you also update the Nginx configs and backend connection settings.

## Production Recommendations

1. Use a real domain instead of raw EC2 IP if possible.
2. Add HTTPS with an Ingress or Nginx reverse proxy.
3. Do not keep real secrets committed in Git.
4. Use versioned image tags, not only `latest`.
5. Keep MongoDB private.
6. Restrict EC2 security-group access.
7. Monitor disk usage because MongoDB data is persistent now.
8. Consider moving MongoDB to a managed database later for stronger reliability.

## Full Command Flow

If you want the short version:

```bash
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>
curl -sfL https://get.k3s.io | sh -
git clone <YOUR_REPO_URL>
cd FOOD-ORDERING-SYS
docker login
docker build -t <DOCKERHUB_USERNAME>/food-ordering-backend:<TAG> ./backend
docker build -t <DOCKERHUB_USERNAME>/food-ordering-frontend:<TAG> ./frontend
docker build -t <DOCKERHUB_USERNAME>/food-ordering-admin:<TAG> ./admin-panel
docker push <DOCKERHUB_USERNAME>/food-ordering-backend:<TAG>
docker push <DOCKERHUB_USERNAME>/food-ordering-frontend:<TAG>
docker push <DOCKERHUB_USERNAME>/food-ordering-admin:<TAG>
kubectl apply -f k8s/namespace.yml
kubectl create secret generic food-ordering-secret -n food-ordering --from-literal=mongo-root-username=admin --from-literal=mongo-root-password='<STRONG_MONGO_PASSWORD>' --from-literal=jwt-secret='<STRONG_JWT_SECRET>' --from-literal=admin-email='<ADMIN_EMAIL>' --from-literal=admin-password='<STRONG_ADMIN_PASSWORD>' --from-literal=admin-name='<ADMIN_NAME>' --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f k8s/backend-config.yml
kubectl apply -f k8s/web-config.yml
kubectl apply -f k8s/mongodb-pvc.yml
kubectl apply -f k8s/mongodb-deployment.yml
kubectl apply -f k8s/mongodb-service.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
kubectl apply -f k8s/admin-panel-deployment.yml
kubectl apply -f k8s/admin-panel-service.yml
kubectl set image deployment/backend backend=<DOCKERHUB_USERNAME>/food-ordering-backend:<TAG> -n food-ordering
kubectl set image deployment/frontend frontend=<DOCKERHUB_USERNAME>/food-ordering-frontend:<TAG> -n food-ordering
kubectl set image deployment/admin-panel admin-panel=<DOCKERHUB_USERNAME>/food-ordering-admin:<TAG> -n food-ordering
kubectl get pods -n food-ordering
kubectl get svc -n food-ordering
```

## Cleanup

```bash
kubectl delete namespace food-ordering
```
