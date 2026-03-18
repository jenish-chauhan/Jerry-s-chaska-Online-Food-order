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

        stage('Build and Run  mysql') {
            steps {
                echo 'create mysql image'
                sh 'cd mysql'
                sh 'docker build -t mysql .'
                sh 'docker create network jerry-network'
                sh 'docker volume create jerrys-mysql-data'
                sh 'docker run -d --name jerrys-mysql --network jerry-network -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=jerrys_chaska -p 3306:3306 -v jerrys-mysql-data:/var/lib/mysql -v ${PWD}\init.sql:/docker-entrypoint-initdb.d/init.sql mysql'
            }
        }
        stage('Build and Run  backend image') {
            steps {
                echo 'create backend image'
                sh 'cd ..'
                sh 'cd backend'
                sh 'docker build -t jerrys-backend:1.0 .'
                sh 'docker run -d --name jerrys-backend --network jerrys-network -p 5000:5000 -e PORT=5000 -e NODE_ENV=production -e DB_HOST=jerrys-mysql -e DB_PORT=3306 -e DB_USER=root -e DB_PASSWORD=rootpassword -e DB_NAME=jerrys_chaska -e JWT_SECRET=supersecret  -e FRONTEND_URL=http://${env.HOSTNAME}:3000 jerrys-backend:1.0'
            }
        }

        stage('Build and Run  frontend image') {
            steps {
                echo 'create frontend image'
                sh 'cd ..'
                sh 'cd frontend'
                sh 'docker build --build-arg VITE_API_URL=http://${env.HOSTNAME}:5000/api -t jerrys-frontend:1.0 .'
                sh 'docker run -d --name jerrys-frontend --network jerrys-network -p 3000:80 jerrys-frontend:1.0'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Waiting for services to be ready...'
                // Simple wait/check logic can be added here
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
