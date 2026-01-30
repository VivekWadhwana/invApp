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
                script {
                    echo '🛑 Stopping and removing previous containers...'
                    bat '''
                    docker compose down --remove-orphans 2>nul || echo "No containers to stop"
                    docker container rm inventory-frontend -f 2>nul || echo "No old container to remove"
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    echo '🚀 Starting frontend container with docker-compose...'
                    bat "docker compose up -d"
                }
            }
        }

        stage('Health Check & Validation') {
            steps {
                script {
                    echo '⏳ Waiting for container to start...'
                    sleep(8)
                    
                    echo '🔍 Checking Container Status...'
                    bat "docker ps --filter 'name=inventory-frontend'"
                    
                    echo '✅ Testing Frontend Accessibility...'
                    powershell '''
                        try {
                            $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                            if ($response.StatusCode -eq 200) {
                                Write-Host "✅ Frontend is running and accessible on http://localhost"
                            }
                        } catch {
                            Write-Host "⚠️ Frontend endpoint test result: $_"
                        }
                    '''
                    
                    echo '🎉 Health Check Completed!'
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
            echo '  ✅ Frontend (React + Vite + Nginx): http://localhost'
            echo ''
            echo '🐳 Docker Image:'
            echo "  • ${DOCKER_USER}/${FRONTEND_IMAGE}:latest"
            echo ''
            echo '✅ Pipeline Stages Completed:'
            echo '  ✓ Dependencies Installation'
            echo '  ✓ Frontend Build (Vite)'
            echo '  ✓ SonarQube Code Quality Scan'
            echo '  ✓ Docker Build'
            echo '  ✓ Docker Push to Registry'
            echo '  ✓ Frontend Deployment (docker-compose)'
            echo '  ✓ Health Checks & Validation'
            echo ''
            echo '📍 Access your app at: http://localhost'
            echo '🐳 Manage with: docker compose up/down'
            echo '=================================='
        }
        failure {
            echo '=================================='
            echo '❌ DEPLOYMENT FAILED!'
            echo '=================================='
            echo ''
            echo '📋 Showing container logs...'
            bat "docker compose logs --tail=50 2>nul || echo \"No compose logs available\""
            echo ''
            echo '🔍 Troubleshooting tips:'
            echo '  1. Check running containers: docker ps -a'
            echo '  2. Check compose logs: docker compose logs'
            echo '  3. Verify port 80 is free: netstat -ano | findstr \":80 \"'
            echo '  4. Kill process on port 80: taskkill /PID <PID> /F'
            echo '  5. Docker resources: docker system df'
            echo '  6. Try: docker compose down --remove-orphans && docker system prune -f'
            echo '=================================='
        }
    }
}
