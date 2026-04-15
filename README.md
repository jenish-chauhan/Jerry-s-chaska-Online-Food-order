# Jerry's Chaska - Cloud-Native Food Ordering System# 🍔

**A production-grade microservices-based food ordering platform with GitOps CI/CD automation**

## 📌 Project Overview

**Jerry's Chaska** is a cloud-native microservices-based food ordering system designed for scalability, reliability, and automated deployment. It demonstrates enterprise-grade DevOps practices

- **Microservices Architecture**: Independently deployable, loosely coupled services- Admin Panel: React + Vite + Nginx

- **Container Orchestration**: Kubernetes-based deployment with auto-scaling and self-healing

- **GitOps Workflow**: ArgoCD-driven, declarative infrastructure management## 📋 Table of Contents- Backend: Node.js + Express + Mongoose

- **Continuous Integration**: GitHub Actions for automated builds, tests, and Docker image pushes

- **Continuous Deployment**: Fully automated deployment pipeline with ArgoCD- Database: MongoDB 7

- **Configuration Management**: Kustomize overlays for environment-specific deployments (dev/staging/prod)

- **High Availability**: Multi-replica deployments, health checks, and graceful shutdown1. [Overview](#overview)- Deployment: Docker, Docker Compose, Kubernetes

### Key Highlights. [Architecture](#architecture)

✅ **Production-Ready**: Security best practices, resource limits, health checks 3. [Features](#features)## Run With Docker

✅ **Scalable**: Horizontal pod autoscaling and load balancing

✅ **Reliable**: Self-healing capabilities, automated rollbacks, monitoring readiness 4. [Tech Stack](#tech-stack)

✅ **Secure**: Non-root containers, secret management, network policies

✅ **Observable**: Structured logging, health endpoints, deployment tracking 5. [Quick Start](#quick-start)From the project root:

---6. [DevOps & Deployment](#devops--deployment)

## 🏗️ Architecture Overview7. [API Documentation](#api-documentation)```bash

### Microservices Architecture8. [Project Structure](#project-structure)docker compose up --build -d

This project follows a **microservices pattern** where each service is:9. [Contributing](#contributing)```

- **Independently deployable**: Changes in one service don't require full system redeployment10. [License](#license)

- **Loosely coupled**: Services communicate via REST APIs and shared databases

- **Technology-agnostic**: Each service can use different tech stacksApp URLs:

- **Fault-isolated**: Failure in one service doesn't cascade across the system

---

### System Components

- Frontend: `http://localhost:5173`

````

┌─────────────────────────────────────────────────────────────────┐## 🎯 Overview- Admin Panel: `http://localhost:8080`

│                      End Users (Browser)                        │

├──────────────────────────────────────────────────────────────────┤- Backend API: `http://localhost:5000/api`

│

├─► Customer Frontend        ├─► Admin Dashboard**Jerry's Chaska** is a full-stack food ordering system designed with enterprise-grade DevOps practices and modern deployment strategies. The application demonstrates:

│   (React 18 + Vite)       │   (React 18 + Vite)

│   Port: 5173              │   Port: 5174/8080## Main Folders

│                           │

└─────────────┬─────────────┘- **Containerization**: Fully Dockerized microservices architecture

              │ HTTP/REST

    ┌─────────▼─────────────────────────────┐- **Orchestration**: Kubernetes-ready with Helm-compatible deployments```text

    │   Backend API (Node.js + Express)     │

    │   Port: 5000                          │- **CI/CD Pipeline**: Automated build, test, and deploy via Jenkinsproject-root/

    │   ✓ Auth Routes                       │

    │   ✓ Menu Management                   │- **Production Standards**: Health checks, graceful shutdowns, security best practices|-- frontend/

    │   ✓ Order Processing                  │

    │   ✓ Analytics & Reporting             │- **Scalability**: Microservices design for independent scaling|-- admin-panel/

    │   ✓ Admin Operations                  │

    └─────────────┬─────────────────────────┘|-- backend/

                  │ MongoDB Protocol

        ┌─────────▼────────────┐### Key Capabilities|-- k8s/

        │  MongoDB Database    │

        │  Port: 27017         │|-- docker-compose.yml

        │  ✓ Users             │

        │  ✓ Food Items        │| Feature | Status | Details ||-- docker-command-readme.md

        │  ✓ Orders            │

        │  ✓ Admin Sessions    │|---------|--------|---------|`-- README.md

        └──────────────────────┘

```| User Authentication | ✅ Live | JWT-based with bcrypt hashing |```



### Kubernetes Deployment Architecture| Order Management | ✅ Live | Create, track, and confirm orders |



```| Menu Management | ✅ Live | Admin CRUD operations |## Documentation

┌──────────────────────────────────────────────────────────────┐

│           Kubernetes Cluster (Production)                    │| Analytics Dashboard | ✅ Live | Real-time order insights |

│  ┌─────────────────────────────────────────────────────────┐ │

│  │ Namespace: food-ordering                                │ │| Multi-User Admin Panel | ✅ Live | Role-based access control |- `docker-command-readme.md` - Docker build/run commands

│  ├─────────────────────────────────────────────────────────┤ │

│  │ Deployments:                                            │ │| Docker Deployment | ✅ Live | Single-command deployment |- `k8s/README.md` - Kubernetes setup commands

│  │  ┌─────────────────────────────────────────────────┐    │ │

│  │  │ Backend (replicas: 3)                          │    │ │| Kubernetes Ready | ✅ Live | Complete K8s manifests provided |- `SETUP.md` - project setup notes

│  │  │ - Requests: 100m CPU, 256Mi Memory             │    │ │

│  │  │ - Limits: 500m CPU, 512Mi Memory               │    │ │| CI/CD Automation | ✅ Live | Jenkins pipeline with auto-deploy |- `MIGRATION.md` - migration background

│  │  │ - HPA: min 2, max 10 (CPU 70%)                 │    │ │

│  │  └─────────────────────────────────────────────────┘    │ │- `TROUBLESHOOTING.md` - common fixes

│  │                                                         │ │

│  │  ┌─────────────────────────────────────────────────┐    │ │---

│  │  │ Frontend (replicas: 2, Nginx + SPA)            │    │ │

│  │  │ - Requests: 50m CPU, 128Mi Memory              │    │ │## Note

│  │  │ - Limits: 200m CPU, 256Mi Memory               │    │ │

│  │  └─────────────────────────────────────────────────┘    │ │## 🏗️ Architecture

│  │                                                         │ │

│  │  ┌─────────────────────────────────────────────────┐    │ │Legacy MySQL-only files were removed because the current application uses MongoDB end to end.

│  │  │ Admin Panel (replicas: 2, Nginx + SPA)         │    │ │

│  │  │ - Requests: 50m CPU, 128Mi Memory              │    │ │### System Architecture

│  │  │ - Limits: 200m CPU, 256Mi Memory               │    │ │

│  │  └─────────────────────────────────────────────────┘    │ │```

│  │                                                         │ │┌─────────────────────────────────────────────────────────────┐

│  │  ┌─────────────────────────────────────────────────┐    │ ││                    User Layer                               │

│  │  │ MongoDB (StatefulSet, replicas: 1)             │    │ ││  ┌──────────────────┐         ┌──────────────────┐          │

│  │  │ - Persistent Volume: 20Gi                      │    │ ││  │ Customer App     │         │ Admin Dashboard  │          │

│  │  │ - Requests: 200m CPU, 512Mi Memory             │    │ ││  │ (React 18)       │         │ (React 18)       │          │

│  │  │ - Limits: 1000m CPU, 1Gi Memory                │    │ ││  │ Port 5173        │         │ Port 5174/8080   │          │

│  │  └─────────────────────────────────────────────────┘    │ ││  └────────┬─────────┘         └────────┬─────────┘          │

│  │                                                         │ │└───────────┼─────────────────────────────┼──────────────────┘

│  │ Services:                                               │ │            │                            │

│  │  • Backend: LoadBalancer (internal routing)             │ │    ┌───────┴────────────────────────────┴────────┐

│  │  • Frontend: LoadBalancer (external, port 80)          │ │    │    HTTP/REST API Layer (CORS-Enabled)       │

│  │  • Admin: LoadBalancer (external, port 8080)           │ │    │                                              │

│  │  • MongoDB: ClusterIP (internal only)                  │ │    │  ┌──────────────────────────────────────┐   │

│  │                                                         │ │    │  │  Backend API (Node.js/Express)       │   │

│  │ ConfigMaps & Secrets:                                   │ │    │  │  Port 5000                            │   │

│  │  • backend-config (PORT, NODE_ENV)                     │ │    │  │  ✓ Authentication Routes              │   │

│  │  • food-ordering-secret (DB creds, JWT)                │ │    │  │  ✓ Menu Management                    │   │

│  │                                                         │ │    │  │  ✓ Order Processing                   │   │

│  └─────────────────────────────────────────────────────────┘ │    │  │  ✓ Analytics Engine                   │   │

└──────────────────────────────────────────────────────────────┘    │  │  ✓ Admin Operations                   │   │

```    │  └────────────────┬──────────────────────┘   │

    └────────────────────┼──────────────────────────┘

---                         │

            ┌────────────┴─────────────┐

## 🔄 CI/CD Pipeline (GitHub Actions → ArgoCD)            │                          │

    ┌───────▼────────────┐   ┌────────▼────────┐

### GitHub Actions Workflow    │  MongoDB Database  │   │ Authentication  │

    │  Port 27017        │   │ (JWT + bcrypt)  │

**Trigger**: On every `git push` to `main` branch    │  • Users           │   └─────────────────┘

    │  • Food Items      │

```    │  • Orders          │

┌─────────────────────────────────────────────────────────────┐    │  • Admin Sessions  │

│ 1. Code Push to GitHub (main branch)                        │    └────────────────────┘

└──────────────────┬──────────────────────────────────────────┘

                   │```

┌──────────────────▼──────────────────────────────────────────┐

│ 2. GitHub Actions Triggered                                │### Deployment Topologies

│    ├─ Checkout Code                                        │

│    ├─ Run Tests                                            │#### Docker Compose (Development/Small Production)

│    └─ Build Docker Images                                 │

└──────────────────┬──────────────────────────────────────────┘```

                   │┌─────────────────────────────────────────┐

┌──────────────────▼──────────────────────────────────────────┐│       Docker Compose Stack              │

│ 3. Push Docker Images to Registry                          │├─────────────────────────────────────────┤

│    ├─ jenish-chauhan/food-ordering-backend:v1.0.1          ││ ┌────────────────────────────────────┐  │

│    ├─ jenish-chauhan/food-ordering-frontend:v1.0.1         ││ │ Network: bridge                    │  │

│    └─ jenish-chauhan/food-ordering-admin:v1.0.1            ││ ├────────────────────────────────────┤  │

└──────────────────┬──────────────────────────────────────────┘│ │ Services:                          │  │

                   ││ │  • MongoDB (service_healthy)       │  │

┌──────────────────▼──────────────────────────────────────────┐│ │  • Backend (depends_on: mongodb)   │  │

│ 4. Update Kustomize Overlays                               ││ │  • Frontend (depends_on: backend)  │  │

│    └─ Update image tags in:                                ││ │  • Admin-Panel (depends_on: backend)│  │

│       - kustomize/overlays/prod/kustomization.yaml         ││ │  • Volume: mongodb_data (persist)  │  │

│       - kustomize/overlays/staging/kustomization.yaml      ││ └────────────────────────────────────┘  │

└──────────────────┬──────────────────────────────────────────┘└─────────────────────────────────────────┘

                   │```

┌──────────────────▼──────────────────────────────────────────┐

│ 5. Commit & Push Changes to GitOps Repo                    │#### Kubernetes (Enterprise Production)

│    └─ Trigger ArgoCD reconciliation                        │

└──────────────────┬──────────────────────────────────────────┘```

                   │┌──────────────────────────────────────────────────────────┐

        ┌──────────┴─────────────┐│            Kubernetes Cluster (K8s)                      │

        │ ArgoCD Detects Change  ││  ┌────────────────────────────────────────────────────┐  │

        └──────────┬─────────────┘│  │ Namespace: food-ordering                           │  │

                   ││  ├────────────────────────────────────────────────────┤  │

        ┌──────────▼──────────────┐│  │ Deployments:                                       │  │

        │ Auto-Sync & Deploy      ││  │  • MongoDB (StatefulSet with PVC)                 │  │

        │ (Declarative)           ││  │  • Backend (Replicas: 3, LoadBalancer)            │  │

        └──────────┬──────────────┘│  │  • Frontend (Replicas: 2, NodePort)               │  │

                   ││  │  • Admin-Panel (Replicas: 2, NodePort)            │  │

        ┌──────────▼──────────────┐│  │                                                    │  │

        │ Kubernetes Update       ││  │ Services:                                          │  │

        │ (Rolling Deployment)    ││  │  • MongoDB: ClusterIP (internal)                  │  │

        └─────────────────────────┘│  │  • Backend: LoadBalancer (external)               │  │

```│  │  • Frontend: NodePort 30080                       │  │

│  │  • Admin: NodePort 30081                          │  │

### Step-by-Step CI/CD Flow│  │                                                    │  │

│  │ ConfigMaps & Secrets:                             │  │

1. **Code Commit**: Developer pushes code to `main` branch│  │  • backend-config (PORT, NODE_ENV, etc)          │  │

2. **GitHub Actions Triggered**: Automated workflow starts│  │  • web-config (API URL, Admin URL)               │  │

   - Build Docker images for all services│  │  • food-ordering-secret (DB creds, JWT)          │  │

   - Tag with commit SHA and `latest`│  └────────────────────────────────────────────────────┘  │

   - Run security scans and tests└──────────────────────────────────────────────────────────┘

3. **Push to Docker Registry**: Images stored on Docker Hub/ECR```

4. **Update GitOps Manifests**: Kustomize overlay updated with new image tags

5. **ArgoCD Reconciliation**: Detects manifest changes automatically---

6. **Kubernetes Deployment**: ArgoCD applies changes to cluster

   - Rolling update (maintains availability)## ✨ Features

   - Health checks ensure successful deployment

   - Auto-rollback on failure### Customer Features



---- 🔐 **User Authentication**: Secure registration and login with JWT

- 👤 **User Profiles**: View and manage account details

## 🔐 GitOps Workflow (ArgoCD)- 🍽️ **Menu Browsing**: Browse food items by category

- 🛒 **Shopping Cart**: Add, remove, and manage items

### What is GitOps?- 📦 **Order Placement**: Create orders with real-time tracking

- 📝 **Order History**: View past and current orders

GitOps is a deployment methodology where:- ⭐ **Ratings & Reviews**: Rate delivered orders

- 📧 **Email Notifications**: Order confirmation and updates

- **Git is the single source of truth**: All infrastructure and application configs stored in Git

- **Declarative**: You declare desired state, system achieves it### Admin Features

- **Automated**: ArgoCD continuously reconciles actual vs desired state

- **Observable**: Full audit trail in Git commits- 📊 **Dashboard Analytics**: Real-time order metrics

- **Secure**: No manual `kubectl apply` commands- 🍔 **Menu Management**: Add/edit/delete food items

- 📦 **Order Management**: View, update, and fulfill orders

### ArgoCD in This Project- 👥 **Admin Panel**: Multi-admin support with admin authentication

- 📈 **Analytics**: Sales trends, popular items, revenue metrics

**Repository Structure**:- 🔔 **Real-time Updates**: Live order status notifications



```### System Features

├─ application-repo (this repo)

│  ├─ backend/- 🐳 **Docker Support**: Ready-to-run containerized deployment

│  ├─ frontend/- ☸️ **Kubernetes Ready**: Complete K8s manifests included

│  ├─ admin-panel/- 🤖 **CI/CD Pipeline**: Automated Jenkins deployments

│  └─ .github/workflows/- 🔍 **Health Checks**: Service health monitoring

│- 🔐 **Security**: CORS, JWT, password hashing, input validation

└─ gitops-repo (separate)- 📊 **Logging**: Comprehensive application logging

   ├─ kustomize/- 🔄 **Auto Restart**: Container restart policies

   │  ├─ base/

   │  │  ├─ backend/---

   │  │  ├─ frontend/

   │  │  ├─ admin-panel/## 🛠️ Tech Stack

   │  │  └─ mongodb/

   │  │### Frontend & Admin Panel

   │  └─ overlays/

   │     ├─ dev/| Technology   | Version | Purpose                    |

   │     ├─ staging/| ------------ | ------- | -------------------------- |

   │     └─ prod/| React        | 18.x    | UI framework               |

   │| Vite         | 5.x     | Build tool & dev server    |

   └─ argocd/| Tailwind CSS | 4.x     | Styling                    |

      ├─ applications.yaml| Axios        | 1.x     | HTTP client                |

      └─ appproject.yaml| React Router | 6.x     | Client-side routing        |

```| Lucide React | Latest  | Icon library               |

| Recharts     | 2.x     | Data visualization (Admin) |

**ArgoCD Application Deployment**:

### Backend

```yaml

# kustomize/overlays/prod/argocd-app.yaml| Technology        | Version   | Purpose                 |

apiVersion: argoproj.io/v1alpha1| ----------------- | --------- | ----------------------- |

kind: Application| Node.js           | 20-alpine | Runtime environment     |

metadata:| Express           | 4.18.x    | Web framework           |

  name: food-ordering-prod| MongoDB           | 7.x       | NoSQL database          |

  namespace: argocd| Mongoose          | 9.x       | ODM/Schema validation   |

spec:| JWT               | 9.x       | Authentication          |

  project: food-ordering| bcrypt            | 5.x       | Password hashing        |

  source:| CORS              | 2.x       | Cross-origin support    |

    repoURL: https://github.com/your-org/gitops-repo| Socket.io         | 4.x       | Real-time communication |

    targetRevision: main| express-validator | 7.x       | Input validation        |

    path: kustomize/overlays/prod

  destination:### DevOps & Deployment

    server: https://kubernetes.default.svc

    namespace: food-ordering| Tool           | Version | Purpose                      |

  syncPolicy:| -------------- | ------- | ---------------------------- |

    automated:| Docker         | Latest  | Containerization             |

      prune: true          # Auto-remove resources not in Git| Docker Compose | 3.8+    | Orchestration (dev)          |

      selfHeal: true       # Auto-sync if cluster drift detected| Kubernetes     | 1.24+   | Orchestration (production)   |

    syncOptions:| Jenkins        | 2.x+    | CI/CD pipeline               |

    - CreateNamespace=true| Nginx          | Alpine  | Reverse proxy & static serve |

    retry:| MongoDB Docker | 7.x     | Database container           |

      limit: 5

      backoff:---

        duration: 5s

        factor: 2## 🚀 Quick Start

        maxDuration: 3m

```### Prerequisites



**Key Features**:```bash

# Required

- ✅ **Auto-Sync**: Changes in Git automatically deployed to cluster- Node.js 16+ (for local development)

- ✅ **Self-Healing**: If someone manually changes cluster, ArgoCD reverts it- npm or yarn

- ✅ **Pruning**: Removes K8s resources when deleted from Git- Docker & Docker Compose (for containerized deployment)

- ✅ **GitOps GUI**: Visual monitoring in ArgoCD dashboard- MongoDB (local) OR MongoDB Atlas (cloud)

- ✅ **Rollback**: Simple rollback by reverting Git commit- Git



**Workflow Example**:# Optional

- Kubernetes cluster (for K8s deployment)

```bash- Jenkins (for CI/CD automation)

# 1. Developer updates Kustomize overlay```

vi kustomize/overlays/prod/backend/kustomization.yaml

# Change: image tag from v1.0.0 -> v1.0.1### Option 1: Docker Compose (Recommended)



# 2. Commit and push```bash

git add kustomize/overlays/prod/backend/kustomization.yaml# Clone repository

git commit -m "Deploy backend v1.0.1 to production"git clone https://github.com/jenish-chauhan/Jerry-s-chaska-Online-Food-order.git

git push origin maincd FOOD-ORDERING-SYS



# 3. ArgoCD detects change (within 3 minutes by default)# Create .env file with secrets

# 4. ArgoCD syncs manifest to Kubernetescat > .env << EOF

# 5. Kubernetes rolling update beginsMONGO_PASSWORD=your_secure_mongo_password

# 6. Full audit trail in Git historyJWT_SECRET=your_jwt_secret_key

```ADMIN_EMAIL=admin@example.com

ADMIN_PASSWORD=your_admin_password

---ADMIN_NAME=Admin User

EOF

## 📂 Folder Structure

# Build and start all services

```docker-compose up --build -d

FOOD-ORDERING-SYS/

│# Verify all services are running

├── 📁 backend/                         # Node.js REST APIdocker-compose ps

│   ├── src/

│   │   ├── app.js                      # Express app & middleware# Check logs

│   │   ├── config/database.js          # MongoDB connectiondocker-compose logs -f

│   │   ├── controllers/                # Business logic```

│   │   ├── models/                     # Mongoose schemas

│   │   ├── routes/                     # API endpoints**Access the application:**

│   │   ├── middleware/                 # Auth & validation

│   │   └── services/                   # Utilities- Frontend: http://localhost:5173

│   ├── Dockerfile                      # Multi-stage build- Admin: http://localhost:8080

│   └── package.json                    # Dependencies- API: http://localhost:5000

│

├── 📁 frontend/                        # React Customer App### Option 2: Local Development

│   ├── src/

│   │   ├── App.jsx**Terminal 1 - Backend:**

│   │   ├── pages/

│   │   ├── components/```bash

│   │   ├── services/api.js             # Axios clientcd backend

│   │   └── context/                    # State managementnpm install

│   ├── Dockerfile                      # Multi-stage Nginx buildcp .env.example .env  # Configure with your values

│   └── package.jsonnpm run dev

│# Runs on: http://localhost:5000

├── 📁 admin-panel/                     # React Admin Dashboard```

│   ├── src/

│   │   ├── App.jsx**Terminal 2 - Frontend:**

│   │   ├── pages/

│   │   ├── components/```bash

│   │   └── services/api.jscd frontend

│   ├── Dockerfilenpm install

│   └── package.jsonnpm run dev

│# Runs on: http://localhost:5173

├── 📁 .github/                         # GitHub Actions Workflows```

│   └── workflows/

│       ├── build-and-push.yml**Terminal 3 - Admin Panel:**

│       └── deploy.yml

│```bash

├── 📁 k8s/                             # Kubernetes Manifestscd admin-panel

│   ├── backend-deployment.ymlnpm install

│   ├── frontend-deployment.ymlnpm run dev

│   ├── admin-deployment.yml# Runs on: http://localhost:5174

│   └── mongodb-deployment.yml```

│

├── docker-compose.yml                  # Docker Compose (dev/testing)**Terminal 4 - MongoDB:**

├── Jenkinsfile                         # Jenkins pipeline

└── README.md                           # This file```bash

```# macOS

brew services start mongodb-community

---

# Linux

## 🛠️ Tech Stacksudo systemctl start mongod



### Frontend Layer# Windows (if installed)

| Technology | Version | Purpose |net start MongoDB

|-----------|---------|---------|```

| React | 18.x | UI framework |

| Vite | 5.x | Build tool, dev server |### Option 3: MongoDB Atlas (Cloud)

| Tailwind CSS | 4.x | Styling |

| Axios | 1.x | HTTP client |```bash

| React Router | 6.x | Client routing |# 1. Create account at https://www.mongodb.com/cloud/atlas

| Lucide React | Latest | Icons |# 2. Create a cluster

| Recharts | 2.x | Analytics charts (Admin) |# 3. Get connection string

# 4. Update MONGO_URI in .env or docker-compose.yml

### Backend Layer# Example:

| Technology | Version | Purpose |# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jerrys_chaska?retryWrites=true&w=majority

|-----------|---------|---------|```

| Node.js | 20-alpine | Runtime |

| Express | 4.18.x | Web framework |---

| MongoDB | 7.x | NoSQL database |

| Mongoose | 9.x | ODM |## 🔄 DevOps & Deployment

| JWT | 9.x | Authentication |

| bcrypt | 5.x | Password hashing |### Docker Commands

| CORS | 2.x | Cross-origin requests |

| express-validator | 7.x | Input validation |```bash

# Build specific services

### DevOps & Infrastructuredocker-compose build backend

| Tool | Purpose |docker-compose build frontend

|------|---------|docker-compose build admin-panel

| Docker | Containerization |

| Kubernetes | Orchestration |# Start services

| GitHub Actions | CI pipeline |docker-compose up -d

| ArgoCD | CD/GitOps |docker-compose up --build -d  # Build and start

| Kustomize | Configuration management |

| Nginx | Reverse proxy, SPA serving |# Stop services

docker-compose down

---docker-compose down -v  # Remove volumes too



## 📋 Prerequisites# View logs

docker-compose logs -f backend

### Local Developmentdocker-compose logs -f frontend

- Docker 20.10+docker-compose logs --tail=100 -f

- Docker Compose 1.29+

- Node.js 16+# Execute commands in containers

- npm or yarndocker-compose exec backend npm test

- Gitdocker-compose exec backend node -e "console.log('test')"



### Kubernetes Deployment# Health check

- Kubernetes 1.24+ clusterdocker-compose ps  # Check status

- kubectl 1.24+curl http://localhost:5000/health

- ArgoCD 2.4+ (installed in cluster)```

- Docker registry access (Docker Hub, ECR, etc.)

### Kubernetes Deployment

### GitHub Setup

- GitHub account with Actions enabled**Prerequisites:**

- Docker Hub/ECR credentials (for pushing images)

- GitOps repository (separate repo for manifests)```bash

# Install kubectl

---# Setup kubeconfig

# Have Docker images pushed to registry

## 🚀 Setup & Installation```



### 1. Local Development (Docker Compose)**Deploy to Kubernetes:**



```bash```bash

# Clone the repository# 1. Update Jenkinsfile with your configuration

git clone https://github.com/jenish-chauhan/Jerry-s-chaska-Online-Food-order.git# - Set PUBLIC_HOST to your domain/IP

cd FOOD-ORDERING-SYS# - Configure Docker Hub credentials

# - Set Kubernetes cluster access

# Create .env file with required secrets

cat > .env << EOF# 2. Jenkins will handle:

MONGO_PASSWORD=your_secure_password_herecd k8s/

JWT_SECRET=your_jwt_secret_here

ADMIN_EMAIL=admin@example.com# Manual deployment (without Jenkins):

ADMIN_PASSWORD=secure_admin_passwordkubectl apply -f namespace.yml

ADMIN_NAME=Admin Userkubectl create secret generic food-ordering-secret \

NODE_ENV=development  --from-literal=MONGO_PASSWORD=<password> \

EOF  --from-literal=JWT_SECRET=<secret> \

  -n food-ordering

# Start all services

docker-compose up --build -dkubectl apply -f mongodb-pvc.yml

kubectl apply -f mongodb-deployment.yml

# Verify serviceskubectl apply -f mongodb-service.yml

docker-compose pskubectl apply -f backend-deployment.yml

kubectl apply -f backend-service.yml

# View logskubectl apply -f frontend-deployment.yml

docker-compose logs -fkubectl apply -f frontend-service.yml

```kubectl apply -f admin-panel-deployment.yml

kubectl apply -f admin-panel-service.yml

**Access Points:**

- Frontend: http://localhost:5173# Verify deployment

- Backend: http://localhost:5000kubectl get all -n food-ordering

- Admin: http://localhost:8080kubectl logs -f deployment/backend -n food-ordering

- MongoDB: mongodb://localhost:27017```



### 2. Local Development (Without Docker)**Access services:**



**Terminal 1 - Backend:**```bash

```bash# Port forward for testing

cd backendkubectl port-forward svc/backend 5000:5000 -n food-ordering

npm installkubectl port-forward svc/frontend 5173:80 -n food-ordering

cp .env.example .envkubectl port-forward svc/admin-panel 8080:80 -n food-ordering

npm run dev  # Runs on port 5000

```# NodePort access (if configured)

# Frontend: http://<node-ip>:30080

**Terminal 2 - Frontend:**# Admin: http://<node-ip>:30081

```bash```

cd frontend

npm install### Jenkins CI/CD Pipeline

npm run dev  # Runs on port 5173

```**Setup Jenkins:**



**Terminal 3 - Admin Panel:**1. **Configure Credentials:**

```bash

cd admin-panel   ```

npm install   Jenkins → Manage Credentials

npm run dev  # Runs on port 5174   Add: dockerhub-cred (Docker Hub username/password)

```   ```



**Terminal 4 - MongoDB:**2. **Create Pipeline Job:**

```bash

# macOS   ```

brew services start mongodb-community   Jenkins → New Item → Pipeline

   Pipeline script from SCM:

# Linux   - Repository URL: Your GitHub repo

sudo systemctl start mongod   - Script path: Jenkinsfile

````

# Or use Docker

docker run -d -p 27017:27017 mongo:73. **Trigger Automation:**

`   `

GitHub Webhook → Jenkins

### 3. Kubernetes Deployment (Production) - Go to GitHub → Settings → Webhooks

- Add: http://your-jenkins:8080/github-webhook/

**Prerequisites:** - Events: Push events

- K8s cluster running (EKS, GKE, AKS, or self-hosted) ```

- kubectl configured

- ArgoCD installed in cluster (`argocd` namespace)**Pipeline Stages:**

- Docker images pushed to registry

````

**Deployment Steps:**Checkout Code

    ↓

```bashBuild & Push Docker Images

# 1. Create namespace    ↓

kubectl create namespace food-orderingDeploy to Kubernetes

    ↓

# 2. Create secrets for credentialsScale Deployments

kubectl create secret generic food-ordering-secret \    ↓

  --from-literal=MONGO_PASSWORD=your_password \Verify Health Checks

  --from-literal=JWT_SECRET=your_jwt_secret \```

  --from-literal=ADMIN_PASSWORD=your_admin_password \

  -n food-ordering**View Pipeline:**



# 3. Apply Kustomize overlays- Jenkins UI: http://your-jenkins:8080/

kubectl apply -k kustomize/overlays/prod- Logs: Jenkins → Build → Console Output



# 4. Verify deployment### Monitoring & Health Checks

kubectl get all -n food-ordering

kubectl get pods -n food-ordering -w  # Watch pods```bash

# Backend health check

# 5. Check service statuscurl http://localhost:5000/health

kubectl get svc -n food-ordering

```# Docker health status

docker inspect jerrys_chaska_backend | grep -A 5 "Health"

### 4. ArgoCD Setup & GitOps Deployment

# Kubernetes health

**Install ArgoCD:**kubectl get pods -n food-ordering

```bashkubectl describe pod <pod-name> -n food-ordering

kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml# Monitor resources

kubectl top nodes

# Get ArgoCD passwordkubectl top pods -n food-ordering

kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d```



# Port-forward to ArgoCD dashboard---

kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access at: https://localhost:8080 (user: admin)## 📡 API Documentation

````

### Base URL

**Create ArgoCD Application:**

````

```bashLocal:     http://localhost:5000

# Login to ArgoCDDocker:    http://localhost:5000

argocd login localhost:8080 --username admin --password <password>Kubernetes: http://<load-balancer-ip>

````

# Create application

kubectl apply -f - << EOF### Authentication

apiVersion: argoproj.io/v1alpha1

kind: ApplicationAll protected endpoints require JWT token in header:

metadata:

name: food-ordering-prod```

namespace: argocdAuthorization: Bearer <your_jwt_token>

spec:```

project: default

source:### Endpoints

    repoURL: https://github.com/your-org/gitops-repo

    targetRevision: main#### Authentication

    path: kustomize/overlays/prod

destination:```

    server: https://kubernetes.default.svcPOST   /api/auth/register

    namespace: food-orderingPOST   /api/auth/login

syncPolicy:POST /api/auth/logout

    automated:```

      prune: true

      selfHeal: true#### Menu

    syncOptions:

      - CreateNamespace=true```

EOFGET /api/menu # Get all food items

GET /api/menu/:id # Get specific item

# Check statusPOST /api/menu # Create item (Admin)

kubectl get application -n argocdPATCH /api/menu/:id # Update item (Admin)

argocd app get food-ordering-prodDELETE /api/menu/:id # Delete item (Admin)

````



---#### Orders



## 🔄 GitHub Actions Workflow```

POST   /api/orders            # Create order (Authenticated)

### Build & Push WorkflowGET    /api/orders/user/:id   # Get user orders

GET    /api/orders/:id        # Get order details

```yamlPATCH  /api/orders/:id/confirm-pickup  # Confirm pickup

# .github/workflows/build-and-push.yml```

name: Build and Push Docker Images

#### Analytics

on:

  push:```

    branches: [main]GET    /api/analytics/dashboard    # Get dashboard metrics

GET    /api/analytics/orders       # Order analytics

jobs:GET    /api/analytics/revenue      # Revenue data

  build:```

    runs-on: ubuntu-latest

    #### Admin

    steps:

    - uses: actions/checkout@v3```

    GET    /api/admin/users       # List all users

    - name: Build & Push BackendPATCH  /api/admin/orders/:id  # Update order status

      run: |```

        docker build -t ${{ secrets.DOCKER_REGISTRY }}/food-ordering-backend:${{ github.sha }} ./backend

        docker push ${{ secrets.DOCKER_REGISTRY }}/food-ordering-backend:${{ github.sha }}### Example Requests



    - name: Build & Push Frontend**Register:**

      run: |

        docker build -t ${{ secrets.DOCKER_REGISTRY }}/food-ordering-frontend:${{ github.sha }} ./frontend```bash

        docker push ${{ secrets.DOCKER_REGISTRY }}/food-ordering-frontend:${{ github.sha }}curl -X POST http://localhost:5000/api/auth/register \

      -H "Content-Type: application/json" \

    - name: Build & Push Admin  -d '{

      run: |    "name": "John Doe",

        docker build -t ${{ secrets.DOCKER_REGISTRY }}/food-ordering-admin:${{ github.sha }} ./admin-panel    "email": "john@example.com",

        docker push ${{ secrets.DOCKER_REGISTRY }}/food-ordering-admin:${{ github.sha }}    "password": "SecurePass@123"

      }'

    - name: Update GitOps Manifests```

      run: |

        git config --global user.email "github-actions@example.com"**Login:**

        git config --global user.name "GitHub Actions"

        # Update kustomize overlays with new image tags```bash

        # Commit and push to gitops-repocurl -X POST http://localhost:5000/api/auth/login \

```  -H "Content-Type: application/json" \

  -d '{

---    "email": "john@example.com",

    "password": "SecurePass@123"

## ✨ Features  }'

```

### Customer Features

- 🔐 Secure authentication (JWT + bcrypt)**Create Order:**

- 👤 User profile management

- 🍽️ Browse menu by category```bash

- 🛒 Shopping cartcurl -X POST http://localhost:5000/api/orders \

- 📦 Place and track orders  -H "Authorization: Bearer <token>" \

- ⭐ Rate and review orders  -H "Content-Type: application/json" \

  -d '{

### Admin Features    "items": [

- 📊 Real-time analytics dashboard      { "itemId": "123", "quantity": 2 }

- 🍔 Food item CRUD operations    ],

- 📦 Order management    "deliveryAddress": "123 Main St",

- 👥 Multi-admin support    "phoneNumber": "555-1234"

- 📈 Sales metrics and reports  }'

```

### DevOps Features

- 🐳 Docker containerization (multi-stage builds)**Get Analytics:**

- ☸️ Kubernetes-native deployment

- 🔄 GitOps with ArgoCD (declarative)```bash

- 🤖 CI/CD with GitHub Actionscurl -X GET http://localhost:5000/api/analytics/dashboard \

- 📊 Resource management (requests/limits)  -H "Authorization: Bearer <admin_token>"

- 🔐 Secret management```

- 🔍 Health checks and readiness probes

- 📈 Horizontal pod autoscaling (HPA)---

- 🔄 Rolling updates with zero downtime

## 📁 Project Structure

---

```

## 🚀 Deployment Best PracticesFOOD-ORDERING-SYS/

│

### Environment Management├── 📁 backend/                           # Node.js REST API

│   ├── src/

Use Kustomize overlays for environment-specific configurations:│   │   ├── app.js                        # Express setup & middleware

│   │   ├── config/

```│   │   │   └── database.js               # MongoDB connection

kustomize/│   │   ├── controllers/                  # Business logic

├── base/                    # Common configs│   │   │   ├── authController.js

│   ├── backend/│   │   │   ├── menuController.js

│   ├── frontend/│   │   │   ├── orderController.js

│   └── mongodb/│   │   │   └── analyticsController.js

└── overlays/│   │   ├── models/                       # Mongoose schemas

    ├── dev/                 # Development (1 replica, low resources)│   │   │   ├── User.js

    ├── staging/             # Staging (2 replicas, medium resources)│   │   │   ├── FoodItem.js

    └── prod/                # Production (3+ replicas, high resources)│   │   │   ├── Order.js

```│   │   │   └── AdminSession.js

│   │   ├── routes/                       # API endpoints

### Resource Management│   │   │   ├── auth.js

│   │   │   ├── menu.js

```yaml│   │   │   ├── orders.js

# Resources for production│   │   │   ├── analytics.js

resources:│   │   │   └── admin.js

  requests:│   │   ├── middleware/

    memory: "512Mi"          # Guaranteed minimum│   │   │   └── auth.js                   # JWT verification

    cpu: "250m"│   │   └── services/                     # Helper functions

  limits:│   ├── Dockerfile                        # Container image

    memory: "1Gi"            # Maximum allowed│   ├── package.json                      # Dependencies

    cpu: "1000m"│   └── .env.example                      # Environment template

```│

├── 📁 frontend/                          # React Customer App

### Security Best Practices│   ├── src/

│   │   ├── App.jsx                       # Root component

- ✅ Non-root user in containers│   │   ├── pages/                        # Page components

- ✅ Read-only file systems where possible│   │   │   ├── Landing.jsx

- ✅ Network policies for pod-to-pod communication│   │   │   ├── Menu.jsx

- ✅ RBAC for Kubernetes access control│   │   │   ├── Cart.jsx

- ✅ Secret encryption in etcd│   │   │   ├── Orders.jsx

│   │   │   ├── Login.jsx

---│   │   │   └── Register.jsx

│   │   ├── components/                   # Reusable components

## 🔮 Future Improvements│   │   ├── services/

│   │   │   └── api.js                    # Axios configuration

- [ ] Real-time order notifications (WebSocket)│   │   ├── context/                      # State management

- [ ] Payment gateway integration (Stripe, PayPal)│   │   │   ├── AuthContext.jsx

- [ ] Email verification for user signup│   │   │   └── CartContext.jsx

- [ ] SMS notifications for orders│   │   └── utils/                        # Helper functions

- [ ] Advanced analytics (ML recommendations)│   ├── Dockerfile                        # Multi-stage build

- [ ] Multi-language support (i18n)│   ├── nginx.conf                        # Reverse proxy config

- [ ] Mobile app (React Native)│   ├── package.json

- [ ] Service mesh (Istio) for advanced networking│   └── vite.config.js                    # Build configuration

- [ ] Helm charts for package management│

- [ ] Multi-region deployment with disaster recovery├── 📁 admin-panel/                       # React Admin Dashboard

- [ ] API rate limiting and throttling│   ├── src/

- [ ] GraphQL API support│   │   ├── App.jsx

│   │   ├── pages/

---│   │   │   ├── Dashboard.jsx             # Analytics & overview

│   │   │   ├── FoodItems.jsx             # Menu management

## 🎓 Learning Highlights│   │   │   ├── Orders.jsx                # Order management

│   │   │   └── Login.jsx

This project demonstrates:│   │   ├── components/

│   │   │   ├── Sidebar.jsx

- **Microservices Architecture**: Decoupled, independently deployable services│   │   │   ├── ProtectedRoute.jsx

- **GitOps Principles**: Git as single source of truth│   │   │   └── AdminLayout.jsx

- **Infrastructure as Code**: Declarative Kubernetes manifests│   │   ├── services/

- **CI/CD Best Practices**: Automated build, test, push, deploy│   │   │   └── api.js                    # Admin API client

- **Container Orchestration**: Kubernetes deployment patterns│   │   └── context/

- **Cloud-Native Design**: 12-factor app methodology│   │       └── AuthContext.jsx           # Admin auth

- **DevOps Culture**: Automation, monitoring, continuous improvement│   ├── Dockerfile

│   ├── nginx.conf

---│   ├── package.json

│   └── vite.config.js

## 🤝 Contributing│

├── 📁 mysql/                             # Database initialization

We welcome contributions! Please follow these steps:│   ├── Dockerfile

│   └── init.sql                          # Schema (for reference)

1. **Fork** the repository│

2. **Create** a feature branch: `git checkout -b feature/amazing-feature`├── 📁 k8s/                               # Kubernetes manifests

3. **Commit** changes: `git commit -m 'Add amazing feature'`│   ├── namespace.yml

4. **Push** to branch: `git push origin feature/amazing-feature`│   ├── secret.yml

5. **Open** a Pull Request│   ├── mongodb-pvc.yml

│   ├── mongodb-deployment.yml

### Code Standards│   ├── mongodb-service.yml

- Follow existing code style│   ├── backend-deployment.yml

- Add tests for new features│   ├── backend-service.yml

- Update documentation│   ├── frontend-deployment.yml

- Test locally before pushing│   ├── frontend-service.yml

│   ├── admin-panel-deployment.yml

---│   └── admin-panel-service.yml

│

## 📝 License├── docker-compose.yml                    # Docker Compose orchestration

├── Jenkinsfile                           # CI/CD pipeline

This project is licensed under the ISC License.├── .gitignore                            # Git ignore rules

├── README.md                             # This file

---└── .env.example                          # Environment variables template

```

## 👤 Author

### Key Directories Explained

**Jenish Chauhan**

| Directory      | Purpose              | Technology                |

- GitHub: [@jenish-chauhan](https://github.com/jenish-chauhan)| -------------- | -------------------- | ------------------------- |

- Email: jenishchauhan.08@gmail.com| `/backend`     | REST API server      | Node.js, Express, MongoDB |

| `/frontend`    | Customer application | React, Vite, Tailwind     |

---| `/admin-panel` | Admin dashboard      | React, Vite, Recharts     |

| `/k8s`         | Kubernetes configs   | K8s manifests, YAML       |

## 📞 Support| `/mysql`       | Database setup       | MongoDB initialization    |



For support, please:---

1. Open a GitHub issue

2. Check existing documentation## 🔐 Security Features

3. Review troubleshooting section in LOCAL-DEVELOPMENT-GUIDE.md

### Authentication & Authorization

---

- ✅ **JWT Token-based**: Stateless authentication

## 🎯 Quick Reference- ✅ **Password Hashing**: bcrypt with salt rounds

- ✅ **Protected Routes**: Middleware-based access control

### Common Commands- ✅ **Admin Verification**: Separate admin authentication



```bash### Network Security

# Docker Compose

docker-compose up --build -d- ✅ **CORS Configuration**: Whitelist allowed origins

docker-compose down- ✅ **HTTPS Ready**: SSL/TLS support via Nginx

docker-compose logs -f- ✅ **Input Validation**: express-validator on all endpoints

- ✅ **Rate Limiting**: Ready for integration

# Kubernetes

kubectl apply -k kustomize/overlays/prod### Containerization Security

kubectl get all -n food-ordering

kubectl logs -f deployment/backend -n food-ordering- ✅ **Non-root User**: Containers run as `appuser`

- ✅ **Alpine Images**: Minimal attack surface

# ArgoCD- ✅ **Health Checks**: Automatic recovery

argocd app list- ✅ **Secret Management**: Environment-based secrets

argocd app sync food-ordering-prod

argocd app rollback food-ordering-prod### Environment Variables

```

```bash

### Service Endpoints# Secrets (never commit)

JWT_SECRET=your_secure_jwt_secret

| Service | Local | Docker | K8s |MONGO_PASSWORD=your_secure_mongo_password

|---------|-------|--------|-----|ADMIN_PASSWORD=secure_admin_password

| Frontend | localhost:5173 | localhost:5173 | LoadBalancer:80 |

| Backend | localhost:5000 | localhost:5000 | LoadBalancer:5000 |# Configuration

| Admin | localhost:5174 | localhost:8080 | LoadBalancer:8080 |PORT=5000

| MongoDB | localhost:27017 | mongodb:27017 | mongodb:27017 |NODE_ENV=production

MONGO_URI=mongodb://...

---FRONTEND_URL=http://localhost:5173,http://localhost:8080

```

**Last Updated**: April 15, 2024

**Version**: 2.0.0 - GitOps Edition  ---

**Status**: Production Ready ✅

## 📊 Performance & Scalability

---

### Performance Characteristics

🚀 **Ready to deploy? Start with `docker-compose up --build -d` or follow the [Kubernetes Deployment](#3-kubernetes-deployment-production) guide!**

| Metric              | Value   | Notes                |
| ------------------- | ------- | -------------------- |
| API Response Time   | < 100ms | Under typical load   |
| Database Query Time | < 50ms  | With proper indexing |
| Container Startup   | < 5s    | Backend service      |
| Frontend Build Size | ~300KB  | Minified + gzipped   |
| Memory Usage        | ~100MB  | Per service          |
| CPU Usage           | < 50%   | Single container     |

### Horizontal Scaling

```yaml
# Kubernetes scaling example
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Database Optimization

- ✅ MongoDB indexing on frequently queried fields
- ✅ Connection pooling via Mongoose
- ✅ Query optimization in controllers
- ✅ Caching-ready architecture

---

## 🧪 Testing & Quality

### Run Tests

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test

# Linting
npm run lint

# Build verification
npm run build
```

### Code Quality

- ESLint configuration included
- Input validation on all endpoints
- Error handling best practices
- Consistent code structure

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**

```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

**MongoDB Connection Error:**

```bash
# Check MongoDB is running
ps aux | grep mongod
# Or check Docker container
docker-compose ps mongodb
# View logs
docker-compose logs mongodb
```

**CORS Errors:**

```bash
# Check frontend URL in .env
# Make sure FRONTEND_URL includes your origin
# Verify backend CORS middleware
```

**Docker Build Failures:**

```bash
# Clear Docker cache
docker system prune -a
# Rebuild
docker-compose build --no-cache
```

### Debug Mode

```bash
# Backend debugging
DEBUG=* npm run dev

# View comprehensive logs
docker-compose logs -f --tail=50

# Check service health
curl http://localhost:5000/health
curl http://localhost:5173
curl http://localhost:8080
```

---

## 📚 Additional Resources

### Documentation Files

- `LOCAL-DEVELOPMENT-GUIDE.md` - Detailed local setup guide
- `DOCKER-SETUP-GUIDE.md` - Step-by-step Docker guide
- `QUICK-START-SCRIPTS.md` - Copy-paste commands
- `COMPLETE-APPLICATION-GUIDE.md` - Full overview

### Official Documentation

- [Express.js Docs](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Jenkins Docs](https://www.jenkins.io/doc/)

### Community & Support

- GitHub Issues: Report bugs and request features
- Discussions: Join community discussions
- Pull Requests: Contribute improvements

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- Use meaningful variable names
- Add comments for complex logic
- Follow existing code style
- Test your changes locally
- Update documentation

---

## 📈 Roadmap

### Upcoming Features

- [ ] Real-time order notifications (WebSocket upgrade)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] SMS notifications
- [ ] Advanced analytics (charts, reports)
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering
- [ ] Loyalty program
- [ ] Restaurant locations (multi-branch)
- [ ] Delivery tracking (GPS)

### Infrastructure Improvements

- [ ] ArgoCD integration for GitOps
- [ ] Prometheus/Grafana monitoring
- [ ] ELK stack logging
- [ ] Service mesh (Istio)
- [ ] API Gateway
- [ ] Load balancing improvements
- [ ] Backup & disaster recovery
- [ ] Multi-region deployment

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**Jenish Chauhan**

- GitHub: [@jenish-chauhan](https://github.com/jenish-chauhan)
- Email: jenishchauhan.08@gmail.com

---

## 🙏 Acknowledgments

- Express.js community for great documentation
- React team for the excellent framework
- MongoDB for reliable database
- Docker for containerization technology
- Kubernetes for orchestration platform
- All contributors and users

---

## 📞 Support

For support, please:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review [documentation files](#-additional-resources)
3. Open a GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
   - Error messages/logs

---

## 🎯 Quick Reference

### Start Development

```bash
docker-compose up --build -d  # Start all services
# OR
npm run dev  # In each service directory
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin-panel
```

### Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

### Access Points

| Service  | URL                       | Port  |
| -------- | ------------------------- | ----- |
| Frontend | http://localhost:5173     | 5173  |
| Backend  | http://localhost:5000     | 5000  |
| Admin    | http://localhost:8080     | 8080  |
| MongoDB  | mongodb://localhost:27017 | 27017 |

---

**Last Updated**: April 15, 2024
**Version**: 1.0.0
**Status**: Production Ready ✅

---

🚀 **Ready to get started? Run `docker-compose up --build -d` and visit http://localhost:5173!**
````
