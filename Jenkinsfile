pipeline {
    agent any

    tools {
        nodejs "node"   // configure NodeJS in Jenkins
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/yourusername/vite-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Vite Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t vite-app:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'docker login -u $USER -p $PASS'
                    sh 'docker tag vite-app $USER/vite-app:latest'
                    sh 'docker push $USER/vite-app:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker run -d -p 80:80 $USER/vite-app:latest'
            }
        }
    }
}
