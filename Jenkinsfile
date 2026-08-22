pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t local-app:latest .'
            }
        }
        stage('Deploy Locally') {
            steps {
                sh '''
                    docker stop local-app-container || true
                    docker rm local-app-container || true
                    docker run -d --name local-app-container -p 3000:3000 local-app:latest
                '''
            }
        }
    }
}
