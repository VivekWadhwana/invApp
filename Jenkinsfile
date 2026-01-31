pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "vivek170205/inventory-frontend"
    }
    
    stages {
        stage('Build') {
            steps {
                bat "npm install"
                bat "npm run build"
            }
        }
        
        stage('SonarQube Scan') {
            when {
                expression { return false }
            }
            steps {
                script {
                    try {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                            bat """
                            docker run --rm ^
                                -e SONAR_HOST_URL=http://host.docker.internal:9000 ^
                                -e SONAR_TOKEN=%SONAR_TOKEN% ^
                                -v %WORKSPACE%:/usr/src ^
                                -w /usr/src ^
                                sonarsource/sonar-scanner-cli ^
                                -Dsonar.projectKey=inventory-frontend ^
                                -Dsonar.projectName=Inventory-Frontend ^
                                -Dsonar.sources=src ^
                                -Dsonar.exclusions=node_modules/**,dist/**,build/** ^
                                -Dsonar.sourceEncoding=UTF-8
                            """
                        }
                    } catch (Exception e) {
                        echo "SonarQube scan failed: ${e.message}"
                    }
                }
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                bat "docker build -t %IMAGE_NAME%:latest ."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "echo %PASS% | docker login -u %USER% --password-stdin"
                    bat "docker push %IMAGE_NAME%:latest"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                bat "docker compose down --remove-orphans || echo No containers"
                bat "docker compose up -d frontend portainer dozzle"
                powershell "Start-Sleep -Seconds 10"
            }
        }
    }
    
    post {
        success {
            echo "✅ Frontend deployed: http://localhost"
            echo "🐳 Portainer: http://localhost:9001"
            echo "📜 Dozzle: http://localhost:8081"
        }
        failure {
            echo "❌ Deployment failed"
            bat "docker ps -a"
            bat "docker compose logs --tail=50"
        }
    }
}
