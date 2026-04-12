# Kubernetes And Argo CD Workflow

This folder now supports two ways to deploy the app:

1. Direct Kubernetes apply for local/manual testing.
2. Argo CD + Kustomize for automatic CD to AWS EKS.

The original manifests in `k8s/` were not changed.  
The GitOps-ready structure lives in `k8s/argocd-ready/`.

## Folder Flow

```text
k8s/
|-- namespace.yml
|-- app-secret.yml
|-- backend-config.yml
|-- web-config.yml
|-- mongodb-*.yml
|-- backend-*.yml
|-- frontend-*.yml
|-- admin-panel-*.yml
`-- argocd-ready/
    |-- base/
    |   |-- kustomization.yml
    |   `-- copied Kubernetes manifests used by GitOps
    |-- overlays/
    |   `-- eks/
    |       `-- kustomization.yml
    `-- argocd/
        `-- application.yml
```

## How The Argo CD Flow Works

1. You push code and Kubernetes changes to your Git repository.
2. Argo CD watches the path `k8s/argocd-ready/overlays/eks`.
3. That overlay points to `k8s/argocd-ready/base`.
4. The base contains the Kubernetes resources Argo CD should render and apply.
5. Argo CD compares Git with your EKS cluster.
6. If something changed, Argo CD syncs it automatically to the `food-ordering` namespace.

In short:

```text
Git push -> Argo CD watches repo -> Kustomize builds overlay -> Argo CD syncs to EKS
```

## How Kustomization Works Here

`base/kustomization.yml`:

- Bundles all app manifests into one deployable unit.
- Keeps the GitOps input self-contained for Argo CD.

`overlays/eks/kustomization.yml`:

- Reuses the base for AWS EKS.
- Is the path Argo CD should track.
- Is the correct place to add future EKS-only patches.

Right now the EKS overlay does not change the resources. That is intentional so
the deployed behavior stays aligned with your current manifests.

## Important Note For EKS

Your current Services are still `NodePort` because you asked not to change the
existing Kubernetes manifests.

That means:

- Argo CD can deploy the app to EKS successfully.
- External access on EKS will still follow the current `NodePort` design.
- For a production-style EKS setup, you would usually add an overlay patch later
  for `LoadBalancer` or `Ingress`.

## Commands To Run The App Manually

Run these from the project root:

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS
kubectl apply -k .\k8s\argocd-ready\overlays\eks
kubectl get all -n food-ordering
```

To open the frontend and admin panel locally:

```powershell
kubectl port-forward -n food-ordering svc/frontend 30080:80
kubectl port-forward -n food-ordering svc/admin-panel 30081:80
```

Open:

- Frontend: `http://localhost:30080`
- Admin panel: `http://localhost:30081`

For backend API testing:

```powershell
kubectl port-forward -n food-ordering svc/backend 5000:5000
```

Open:

- Health: `http://localhost:5000/health`
- API sample: `http://localhost:5000/api/menu`

## Commands To Deploy With Argo CD

Make sure:

- Your code is pushed to a Git repository.
- Argo CD is installed and connected to your EKS cluster.
- You update `k8s/argocd-ready/argocd/application.yml` with your real Git repo URL.

Check the rendered manifests before Argo CD uses them:

```powershell
kubectl kustomize .\k8s\argocd-ready\overlays\eks
```

Create the Argo CD application:

```powershell
kubectl apply -n argocd -f .\k8s\argocd-ready\argocd\application.yml
```

Check application status:

```powershell
kubectl get applications -n argocd
kubectl describe application food-ordering-eks -n argocd
```

If you want to open the Argo CD UI locally:

```powershell
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Then open `https://localhost:8080`.

## What You Update Later

When you want a new deployment through Argo CD, usually you change one of these:

- container image tags
- ConfigMap values
- Secret values
- EKS overlay patches

After you commit and push, Argo CD detects the Git change and syncs the cluster
automatically because `automated` sync is enabled in `application.yml`.

## Recommended Next Step

Before applying on EKS, review these files once:

- `k8s/argocd-ready/argocd/application.yml`
- `k8s/argocd-ready/overlays/eks/kustomization.yml`
- `k8s/argocd-ready/base/app-secret.yml`

The secret file currently contains plain values in Git. That works technically,
but for real production use you should later move secrets to Sealed Secrets,
External Secrets, or another secure secret manager.
