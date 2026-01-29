pipeline {
    agent any

    tools {
        nodejs "node"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/VivekWadhwana/invApp.git'
            }
        }

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

        stage('Save Build Files') {
            steps {
                archiveArtifacts artifacts: 'dist/**'
            }
        }
    }
}
