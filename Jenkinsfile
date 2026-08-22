pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'local-app:latest'
        CONTAINER_NAME = 'local-app-container'
        SLACK_CHANNEL  = 'C0BRVCPUG21' // Channel ID for #all-home-cicd
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                // Requires SonarQube Scanner plugin installed in Jenkins
                withSonarQubeEnv('SonarQubeServer') {
                    sh '''
                        npx sonar-scanner \
                          -Dsonar.projectKey=local-cicd-demo \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/** \
                          -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Trivy Image Scan') {
            steps {
                echo 'Scanning Docker image for vulnerabilities...'
                // Runs Trivy container directly via Docker socket
                sh """
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
                      ${IMAGE_NAME}
                """
            }
        }

        stage('Deploy Locally') {
            steps {
                echo 'Deploying application locally...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}
                """
            }
        }
    }
post {
    always {
        cleanWs()
    }
    success {
        slackSend(
            channel: "${env.SLACK_CHANNEL}",
            color: '#36a64f',
            message: "SUCCESS: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}] - (${env.BUILD_URL})"
        )
    }
    failure {
        slackSend(
            channel: "${env.SLACK_CHANNEL}",
            color: '#FF0000',
            message: "FAILED: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}] - (${env.BUILD_URL})"
        )
    }
}
