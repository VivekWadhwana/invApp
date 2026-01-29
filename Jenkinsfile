pipeline {
    agent any

    tools {
        nodejs "node"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Vite Project') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t vite-app .'
            }
        }

        stage('Stop Previous Container') {
            steps {
                bat 'docker rm -f vite-container || exit 0'
            }
        }

        stage('Docker Run') {
            steps {
                bat 'docker run -d -p 80:80 --name vite-container vite-app'
            }
        }
    }
}
