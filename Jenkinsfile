pipeline {

    // Jenkins can run on any agent (Windows/Linux)
    agent any

    // AUTO BUILD WITHOUT WEBHOOK (Poll GitHub every 5 min)
    triggers {
        pollSCM('H/5 * * * *')
    }

    // Environment variables
    environment {
        DOCKER_USER = "vivek170205"
        FRONTEND_IMAGE = "inventory-frontend"
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {

        // 1️⃣ Get Code from GitHub
        stage('Clone Code') {
            steps {
                git 'https://github.com/your-username/your-repo.git'
            }
        }

        // 2️⃣ Install Node Modules
        stage('Install Dependencies') {
            steps {
                bat "npm install"
            }
        }

        // 3️⃣ Build React/Vite App
        stage('Build App') {
            steps {
                bat "npm run build"
            }
        }

        // 4️⃣ Run Tests (Optional)
        stage('Test App') {
            steps {
                bat "npm test || echo No tests"
            }
        }

        // 5️⃣ SonarQube Code Quality Scan
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat """
                    sonar-scanner ^
                    -Dsonar.projectKey=inventory-frontend ^
                    -Dsonar.sources=. ^
                    -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        // 6️⃣ Build Docker Image
        stage('Docker Build') {
            steps {
                bat "docker build -t %DOCKER_USER%/%FRONTEND_IMAGE%:latest ."
            }
        }

        // 7️⃣ Login to DockerHub
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "echo %PASS% | docker login -u %USER% --password-stdin"
                }
            }
        }

        // 8️⃣ Push Docker Image
        stage('Docker Push') {
            steps {
                bat "docker push %DOCKER_USER%/%FRONTEND_IMAGE%:latest"
            }
        }

        // 9️⃣ Stop Old Containers
        stage('Stop Old Containers') {
            steps {
                bat """
                docker compose down --remove-orphans || echo No containers
                docker container rm inventory-frontend -f || echo No old container
                """
            }
        }

        // 🔟 Deploy New Container
        stage('Deploy App') {
            steps {
                bat "docker compose up -d"
            }
        }
    }

    // After pipeline finished
    post {
        success {
            echo "===================================="
            echo "✅ APP DEPLOYED SUCCESSFULLY"
            echo "🌐 Open: http://localhost:3000"
            echo "===================================="
        }
        failure {
            echo "❌ PIPELINE FAILED"
            bat "docker ps -a"
        }
    }
}
