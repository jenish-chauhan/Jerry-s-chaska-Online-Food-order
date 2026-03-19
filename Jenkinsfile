pipeline {
  agent any

  triggers {
    githubPush()
  }

  environment {
    NAMESPACE = 'food-ordering'
    IMAGE_TAG = "${BUILD_NUMBER}"

    // Update this to your EC2 public IP or your domain.
    PUBLIC_HOST = 'YOUR_EC2_PUBLIC_IP_OR_DOMAIN'

    // Change to https if you put the app behind SSL later.
    PUBLIC_PROTOCOL = 'http'

    FRONTEND_PORT = '30080'
    ADMIN_PORT = '30081'
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Build And Push Docker Images') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockerhub-cred',
            usernameVariable: 'DOCKERHUB_USERNAME',
            passwordVariable: 'DOCKERHUB_PASSWORD'
          )
        ]) {
          sh '''
            set -e

            echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

            docker build -t $DOCKERHUB_USERNAME/food-ordering-backend:$IMAGE_TAG ./backend

            docker build \
              --build-arg VITE_API_URL=/api \
              --build-arg VITE_ADMIN_URL=$PUBLIC_PROTOCOL://$PUBLIC_HOST:$ADMIN_PORT/login \
              -t $DOCKERHUB_USERNAME/food-ordering-frontend:$IMAGE_TAG \
              ./frontend

            docker build \
              --build-arg VITE_API_URL=/api \
              -t $DOCKERHUB_USERNAME/food-ordering-admin:$IMAGE_TAG \
              ./admin-panel

            docker push $DOCKERHUB_USERNAME/food-ordering-backend:$IMAGE_TAG
            docker push $DOCKERHUB_USERNAME/food-ordering-frontend:$IMAGE_TAG
            docker push $DOCKERHUB_USERNAME/food-ordering-admin:$IMAGE_TAG
          '''
        }
      }
    }

    stage('Deploy To Kubernetes') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockerhub-cred',
            usernameVariable: 'DOCKERHUB_USERNAME',
            passwordVariable: 'DOCKERHUB_PASSWORD'
          )
        ]) {
          sh '''
            set -e

            # IMPORTANT:
            # kubectl must already be configured on this Jenkins/EC2 machine.
            # Also make sure the Kubernetes secret "food-ordering-secret" already exists.

            kubectl apply -f k8s/namespace.yml

            kubectl create configmap backend-config \
              -n $NAMESPACE \
              --from-literal=PORT=5000 \
              --from-literal=NODE_ENV=production \
              --from-literal=FRONTEND_URL=http://frontend:80,http://admin-panel:80,$PUBLIC_PROTOCOL://$PUBLIC_HOST:$FRONTEND_PORT,$PUBLIC_PROTOCOL://$PUBLIC_HOST:$ADMIN_PORT \
              --from-literal=MONGO_DATABASE=jerrys_chaska \
              --dry-run=client -o yaml | kubectl apply -f -
            kubectl apply -f k8s/secret.yml
            kubectl apply -f k8s/mongodb-pvc.yml
            kubectl apply -f k8s/mongodb-deployment.yml
            kubectl apply -f k8s/mongodb-service.yml
            kubectl apply -f k8s/backend-deployment.yml
            kubectl apply -f k8s/backend-service.yml
            kubectl apply -f k8s/frontend-deployment.yml
            kubectl apply -f k8s/frontend-service.yml
            kubectl apply -f k8s/admin-panel-deployment.yml
            kubectl apply -f k8s/admin-panel-service.yml

            kubectl set image deployment/backend \
              backend=$DOCKERHUB_USERNAME/food-ordering-backend:$IMAGE_TAG \
              -n $NAMESPACE

            kubectl set image deployment/frontend \
              frontend=$DOCKERHUB_USERNAME/food-ordering-frontend:$IMAGE_TAG \
              -n $NAMESPACE

            kubectl set image deployment/admin-panel \
              admin-panel=$DOCKERHUB_USERNAME/food-ordering-admin:$IMAGE_TAG \
              -n $NAMESPACE

            kubectl rollout status deployment/mongodb -n $NAMESPACE --timeout=300s
            kubectl rollout status deployment/backend -n $NAMESPACE --timeout=300s
            kubectl rollout status deployment/frontend -n $NAMESPACE --timeout=300s
            kubectl rollout status deployment/admin-panel -n $NAMESPACE --timeout=300s
          '''
        }
      }
    }
  }

  post {
    always {
      sh '''
        docker logout || true
      '''
    }
  }
}
