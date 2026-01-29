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

        stage('Kill Port 80') {
            steps {
                bat '''
                echo Checking port 80...
                FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :80') DO (
                    echo Killing PID %%P
                    taskkill /PID %%P /F
                )
                '''
            }
        }

        stage('Docker Run') {
            steps {
                bat 'docker rm -f vite-container || exit 0'
                bat 'docker run -d -p 80:80 --name vite-container vite-app'
            }
        }
    }
}
