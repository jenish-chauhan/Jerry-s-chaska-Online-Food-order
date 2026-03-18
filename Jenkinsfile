pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker_hub'
        GIT_REPO_URL = 'https://github.com/jenish-chauhan/Jerry-s-chaska-Online-Food-order.git'
    }

    stages {
        stage('git clone') {
            steps {
                echo 'Fetching project from GitHub...'
                git branch: 'main', url: "${GIT_REPO_URL}"
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Authenticating with Docker Hub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
                    sh "echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin"
                }
            }
        }

        stage('Run MongoDB') {
            steps {
                echo 'Starting MongoDB container...'
                sh 'docker network create jerry-network || true'
                sh 'docker volume create jerrys-mongodb-data || true'
                sh 'docker rm -f jerrys-mongodb || true'
                sh 'docker run -d --name jerrys-mongodb --network jerry-network -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secure_mongo_password -p 27017:27017 -v jerrys-mongodb-data:/data/db mongo:7'
            }
        }

        stage('Build and Run Backend') {
            steps {
                echo 'Building backend image...'
                sh 'cd backend && docker build -t jerrys-backend:1.0 .'
                sh 'docker rm -f jerrys-backend || true'
                sh 'docker run -d --name jerrys-backend --network jerry-network -p 5000:5000 -e PORT=5000 -e NODE_ENV=production -e MONGO_URI=mongodb://admin:secure_mongo_password@jerrys-mongodb:27017/jerrys_chaska?authSource=admin -e JWT_SECRET=supersecret -e FRONTEND_URL=http://${env.HOSTNAME}:3000 jerrys-backend:1.0'
            }
        }

        stage('Build and Run Frontend') {
            steps {
                echo 'Building frontend image...'
                sh 'cd frontend && docker build --build-arg VITE_API_URL=http://${env.HOSTNAME}:5000/api -t jerrys-frontend:1.0 .'
                sh 'docker rm -f jerrys-frontend || true'
                sh 'docker run -d --name jerrys-frontend --network jerry-network -p 3000:80 jerrys-frontend:1.0'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking running containers...'
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Please check the logs.'
        }
    }
}
