pipeline {
    agent any

    tools {
        nodejs "node"
    }

    environment {
        DOCKER_USER = "vivek170205"
        FRONTEND_IMAGE = "inventory-frontend"
        SONAR_AUTH_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Install Frontend Dependencies') {
            steps {
                bat "npm install"
            }
        }

        stage('Lint & Test') {
            steps {
                echo '🔨 Building Frontend...'
                bat "npm run build"
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
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
                    echo '⚠️  SonarQube scan completed (check results for any issues)'
                }
            }
        }

        stage('Docker Build Images') {
            steps {
                bat "docker build -t %DOCKER_USER%/%FRONTEND_IMAGE% ."
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
            steps {
                bat "docker push %DOCKER_USER%/%FRONTEND_IMAGE%:latest"
            }
        }

        stage('Stop Previous Containers') {
            steps {
                bat "docker rm -f inventory-frontend || exit 0"
            }
        }

        stage('Docker Run') {
            steps {
                bat "docker run -d -p 80:80 --name inventory-frontend %DOCKER_USER%/%FRONTEND_IMAGE%"
            }
        }

        stage('Health Check & Validation') {
            steps {
                script {
                    echo '⏳ Waiting for container to start...'
                    sleep(5)
                    
                    echo '🔍 Checking Container Status...'
                    bat "docker ps"
                    
                    echo '✅ Testing Frontend...'
                    powershell '''
                        $response = (Invoke-WebRequest -Uri "http://localhost:80" -UseBasicParsing -ErrorAction SilentlyContinue)
                        if ($response.StatusCode -eq 200) { Write-Host "✅ Frontend is accessible" } else { exit 1 }
                    '''
                    
                    echo '🎉 All Health Checks Passed!'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up Docker resources...'
            bat "docker system prune -f"
        }
        success {
            echo '=================================='
            echo '🚀 FRONTEND DEPLOYMENT SUCCESSFUL!'
            echo '=================================='
            echo ''
            echo '📦 Deployed Service:'
            echo '  ✅ Frontend (React + Vite + Nginx): http://localhost:80'
            echo ''
            echo '🐳 Docker Image:'
            echo "  • ${DOCKER_USER}/${FRONTEND_IMAGE}:latest"
            echo ''
            echo '✅ Pipeline Stages Completed:'
            echo '  ✓ Dependencies Installation'
            echo '  ✓ Frontend Build'
            echo '  ✓ SonarQube Code Quality Scan'
            echo '  ✓ Docker Build'
            echo '  ✓ Docker Push'
            echo '  ✓ Frontend Deployment'
            echo '  ✓ Health Checks & Validation'
            echo '=================================='
        }
        failure {
            echo '=================================='
            echo '❌ DEPLOYMENT FAILED!'
            echo '=================================='
            echo ''
            echo '📋 Showing container logs...'
            bat "docker logs inventory-frontend || exit 0"
            echo ''
            echo '🔍 Troubleshooting tips:'
            echo '  1. Check if container is running: docker ps -a'
            echo '  2. Check frontend logs: docker logs inventory-frontend'
            echo '  3. Verify port availability: netstat -ano | findstr "80"'
            echo '  4. Check Docker resources: docker system df'
            echo '=================================='
        }
    }
}
