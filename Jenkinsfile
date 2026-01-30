pipeline {
    agent any

    tools {
        nodejs "node"
    }

    environment {
        DOCKER_USER = "vivek170205"
        FRONTEND_IMAGE = "inventory-frontend"
        BACKEND_IMAGE = "inventory-backend"
        SONAR_AUTH_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Install Frontend Dependencies') {
            steps {
                bat "npm install"
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat "npm install"
                }
            }
        }

        stage('Build Vite Project') {
            steps {
                bat "npm run build"
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        bat """
                        "${scannerHome}\\bin\\sonar-scanner.bat" ^
                        -Dsonar.projectKey=inventory-fullstack ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=%SONAR_AUTH_TOKEN%
                        """
                    }
                }
            }
        }

        stage('Docker Build Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        bat "docker build -t %DOCKER_USER%/%FRONTEND_IMAGE% ."
                    }
                }
                stage('Build Backend') {
                    steps {
                        bat "docker build -t %DOCKER_USER%/%BACKEND_IMAGE% ./backend"
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "docker login -u %USER% -p %PASS%"
                }
            }
        }

        stage('Docker Push Images') {
            parallel {
                stage('Push Frontend') {
                    steps {
                        bat "docker push %DOCKER_USER%/%FRONTEND_IMAGE%:latest"
                    }
                }
                stage('Push Backend') {
                    steps {
                        bat "docker push %DOCKER_USER%/%BACKEND_IMAGE%:latest"
                    }
                }
            }
        }

        stage('Stop Previous Containers') {
            steps {
                bat "docker compose down || exit 0"
            }
        }

        stage('Deploy Full Stack') {
            steps {
                bat "docker compose up -d"
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sleep(10) // Wait for containers to start
                    bat "curl -f http://localhost:80 || exit 1"
                    bat "curl -f http://localhost:5000/api/inventory || exit 1"
                }
            }
        }
    }

    post {
        always {
            bat "docker system prune -f"
        }
        success {
            echo '🚀 Full-Stack Deployment Successful!'
            echo 'Frontend: http://localhost:80'
            echo 'Backend API: http://localhost:5000'
            echo 'MongoDB: localhost:27017'
        }
        failure {
            echo '❌ Deployment Failed!'
            bat "docker compose logs"
        }
    }
}
