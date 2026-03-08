pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'
        GIT_REPO_URL = 'https://github.com/jenish-chauhan/Jerry-s-chaska-Online-Food-order.git'
    }

    stages {
        stage('Checkout') {
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

        stage('Build and Run') {
            steps {
                echo 'Building and starting containers using Docker Compose...'
                // Using docker-compose to manage networks, volumes, and services
                sh 'docker-compose up -d --build'
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
