pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                bat "npm install"
                bat "npm run build"
            }
        }
        
        stage('SonarQube') {
            steps {
                script {
                    try {
                        withSonarQubeEnv('SonarQube') {
                            withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                                bat """
                                docker run --rm ^
                                    -e SONAR_HOST_URL=%SONAR_HOST_URL% ^
                                    -e SONAR_LOGIN=%SONAR_TOKEN% ^
                                    -v %WORKSPACE%:/usr/src ^
                                    sonarsource/sonar-scanner-cli ^
                                    -Dsonar.projectKey=inventory-frontend ^
                                    -Dsonar.sources=/usr/src ^
                                    -Dsonar.token=%SONAR_TOKEN%
                                """
                            }
                        }
                    } catch (Exception e) {
                        echo "SonarQube scan failed: ${e.message}"
                    }
                }
            }
        }
        
        stage('Docker') {
            steps {
                bat "docker build -t vivek170205/inventory-frontend:latest ."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "echo %PASS% | docker login -u %USER% --password-stdin"
                    bat "docker push vivek170205/inventory-frontend:latest"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                bat "docker compose down --remove-orphans || echo No containers"
                bat "docker compose up -d frontend portainer"
                powershell "Start-Sleep -Seconds 10"
            }
        }
    }
    
    post {
        success {
            echo "✅ Frontend deployed: http://localhost:3000"
            echo "🐳 Portainer: http://localhost:9001"
        }
        failure {
            bat "docker ps -a"
        }
    }
}
