pipeline {

    // Jenkins can run on any agent (Windows/Linux)
    agent any

    // Environment variables
    environment {
        DOCKER_USER = "vivek170205"
        FRONTEND_IMAGE = "inventory-frontend"
        BACKEND_IMAGE = "inventory-backend"
        // Sonar token credential (create a Secret Text credential named 'sonar-token')
        SONAR_TOKEN = credentials('sonar-token')
        // Enable SonarQube stage by setting to 'true' (disabled by default for stability)
        RUN_SONAR = 'true'
    }

    stages {

        // 1️⃣ Get Code from GitHub (Declarative checkout already ran)
        stage('Clone Code') {
            steps {
                echo "Repository already checked out by Declarative pipeline."
            }
        }

        // 2️⃣ Install Dependencies (Parallel)
        stage('Install Dependencies') {
            parallel {
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
            }
        }

        // 3️⃣ Lint & Test (Parallel)
        stage('Lint & Test') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        bat "npm run build"
                    }
                }
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            bat "npm run test"
                        }
                    }
                }
                stage('Lint Backend') {
                    steps {
                        dir('backend') {
                            bat "npm run lint"
                        }
                    }
                }
            }
        }

        // 4️⃣ SonarQube Code Quality Scan (optional)
        stage('SonarQube Scan') {
            when {
                expression { return env.RUN_SONAR == 'true' }
            }
            steps {
                script {
                    try {
                        withSonarQubeEnv('SonarQube') {
                            // Use Dockerized SonarScanner; replace localhost with host.docker.internal
                            // so the container can reach the host Sonar instance on Docker for Windows.
                            bat """
                            rem translate localhost -> host.docker.internal for container access
                            set "SCANNER_HOST=%SONAR_HOST_URL:localhost=host.docker.internal%"
                            docker run --rm ^
                                -e SONAR_HOST_URL=%SCANNER_HOST% ^
                                -e SONAR_LOGIN=%SONAR_TOKEN% ^
                                -v %WORKSPACE%:/usr/src ^
                                sonarsource/sonar-scanner-cli ^
                                -Dsonar.projectKey=inventory-fullstack ^
                                -Dsonar.sources=/usr/src ^
                                -Dsonar.token=%SONAR_TOKEN%
                            """
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'UNSTABLE'
                        echo "⚠️ SonarQube scan failed, marking build UNSTABLE but continuing: ${e.message}"
                    }
                }
            }
        }

        // 5️⃣ Build Docker Images (Parallel)
        stage('Docker Build') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        bat "docker build -t %DOCKER_USER%/%FRONTEND_IMAGE%:latest ."
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            bat "docker build -t %DOCKER_USER%/%BACKEND_IMAGE%:latest ."
                        }
                    }
                }
            }
        }

        // 6️⃣ Login to DockerHub
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "echo %PASS% | docker login -u %USER% --password-stdin"
                }
            }
        }

        // 7️⃣ Push Docker Images (Parallel)
        stage('Docker Push') {
            parallel {
                stage('Push Frontend Image') {
                    steps {
                        bat "docker push %DOCKER_USER%/%FRONTEND_IMAGE%:latest"
                    }
                }
                stage('Push Backend Image') {
                    steps {
                        bat "docker push %DOCKER_USER%/%BACKEND_IMAGE%:latest"
                    }
                }
            }
        }

        // 8️⃣ Stop Old Containers
        stage('Stop Old Containers') {
            steps {
                bat """
                docker compose down --remove-orphans || echo No containers
                docker container rm inventory-frontend inventory-backend inventory-mongodb inventory-prometheus inventory-grafana inventory-node-exporter inventory-cadvisor -f || echo No old containers
                """
            }
        }

        // 9️⃣ Deploy Full Stack with Monitoring
        stage('Deploy Full Stack') {
            steps {
                script {
                    // Check and assign available ports
                    powershell """
                    function Test-Port {
                        param([int]\$Port)
                        try {
                            \$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, \$Port)
                            \$listener.Start()
                            \$listener.Stop()
                            return \$true
                        } catch {
                            return \$false
                        }
                    }
                    
                    function Find-AvailablePort {
                        param([int]\$BasePort)
                        \$port = \$BasePort
                        while (-not (Test-Port \$port)) {
                            \$port++
                            if (\$port -gt (\$BasePort + 100)) {
                                throw "No available ports found in range \$BasePort-\$(\$BasePort + 100)"
                            }
                        }
                        return \$port
                    }
                    
                    \$env:FRONTEND_PORT = Find-AvailablePort 80
                    \$env:BACKEND_PORT = Find-AvailablePort 5000
                    \$env:MONGODB_PORT = Find-AvailablePort 27017
                    \$env:PROMETHEUS_PORT = Find-AvailablePort 9090
                    \$env:GRAFANA_PORT = Find-AvailablePort 3001
                    \$env:NODE_EXPORTER_PORT = Find-AvailablePort 9100
                    \$env:CADVISOR_PORT = Find-AvailablePort 8081
                    
                    Write-Host "Available ports assigned:"
                    Write-Host "Frontend: \$env:FRONTEND_PORT"
                    Write-Host "Backend: \$env:BACKEND_PORT"
                    Write-Host "MongoDB: \$env:MONGODB_PORT"
                    Write-Host "Prometheus: \$env:PROMETHEUS_PORT"
                    Write-Host "Grafana: \$env:GRAFANA_PORT"
                    Write-Host "Node Exporter: \$env:NODE_EXPORTER_PORT"
                    Write-Host "cAdvisor: \$env:CADVISOR_PORT"
                    """
                }
                
                bat "docker compose up -d"
                // Wait for all services to start
                bat "timeout /t 30 /nobreak"
            }
        }

        // 🔟 Health Check & Validation
        stage('Health Check & Validation') {
            steps {
                script {
                    try {
                        // Check container status
                        bat "docker ps"
                        
                        // Test Frontend
                        powershell """
                        try {
                            \$frontendPort = if (\$env:FRONTEND_PORT) { \$env:FRONTEND_PORT } else { 80 }
                            \$response = Invoke-WebRequest -Uri "http://localhost:\$frontendPort" -TimeoutSec 15
                            if (\$response.StatusCode -eq 200) {
                                Write-Host "✅ Frontend is accessible on port \$frontendPort"
                            } else {
                                throw "Frontend returned status: " + \$response.StatusCode
                            }
                        } catch {
                            Write-Host "❌ Frontend health check failed:" \$_.Exception.Message
                            throw
                        }
                        """
                        
                        // Test Backend API - Inventory endpoint
                        powershell """
                        try {
                            \$backendPort = if (\$env:BACKEND_PORT) { \$env:BACKEND_PORT } else { 5000 }
                            \$response = Invoke-WebRequest -Uri "http://localhost:\$backendPort/api/inventory" -TimeoutSec 15
                            if (\$response.StatusCode -eq 200) {
                                Write-Host "✅ Backend Inventory API is working on port \$backendPort"
                            } else {
                                throw "Backend API returned status: " + \$response.StatusCode
                            }
                        } catch {
                            Write-Host "❌ Backend Inventory API health check failed:" \$_.Exception.Message
                            throw
                        }
                        """
                        
                        // Test Prometheus
                        powershell """
                        try {
                            \$prometheusPort = if (\$env:PROMETHEUS_PORT) { \$env:PROMETHEUS_PORT } else { 9090 }
                            \$response = Invoke-WebRequest -Uri "http://localhost:\$prometheusPort/-/healthy" -TimeoutSec 15
                            if (\$response.StatusCode -eq 200) {
                                Write-Host "✅ Prometheus is healthy on port \$prometheusPort"
                            } else {
                                throw "Prometheus returned status: " + \$response.StatusCode
                            }
                        } catch {
                            Write-Host "❌ Prometheus health check failed:" \$_.Exception.Message
                            throw
                        }
                        """
                        
                        // Test Grafana
                        powershell """
                        try {
                            \$grafanaPort = if (\$env:GRAFANA_PORT) { \$env:GRAFANA_PORT } else { 3001 }
                            \$response = Invoke-WebRequest -Uri "http://localhost:\$grafanaPort/api/health" -TimeoutSec 15
                            if (\$response.StatusCode -eq 200) {
                                Write-Host "✅ Grafana is healthy on port \$grafanaPort"
                            } else {
                                throw "Grafana returned status: " + \$response.StatusCode
                            }
                        } catch {
                            Write-Host "❌ Grafana health check failed:" \$_.Exception.Message
                            throw
                        }
                        """
                        
                        // Test Node Exporter
                        powershell """
                        try {
                            \$nodePort = if (\$env:NODE_EXPORTER_PORT) { \$env:NODE_EXPORTER_PORT } else { 9100 }
                            \$response = Invoke-WebRequest -Uri "http://localhost:\$nodePort/metrics" -TimeoutSec 15
                            if (\$response.StatusCode -eq 200) {
                                Write-Host "✅ Node Exporter is working on port \$nodePort"
                            } else {
                                throw "Node Exporter returned status: " + \$response.StatusCode
                            }
                        } catch {
                            Write-Host "❌ Node Exporter health check failed:" \$_.Exception.Message
                            throw
                        }
                        """
                        
                        // Test cAdvisor
                        powershell """
                        try {
                            \$cadvisorPort = if (\$env:CADVISOR_PORT) { \$env:CADVISOR_PORT } else { 8081 }
                            \$response = Invoke-WebRequest -Uri "http://localhost:\$cadvisorPort/healthz" -TimeoutSec 15
                            if (\$response.StatusCode -eq 200) {
                                Write-Host "✅ cAdvisor is working on port \$cadvisorPort"
                            } else {
                                throw "cAdvisor returned status: " + \$response.StatusCode
                            }
                        } catch {
                            Write-Host "❌ cAdvisor health check failed:" \$_.Exception.Message
                            throw
                        }
                        """
                        
                        echo "✅ All services are healthy and running!"
                        
                    } catch (Exception e) {
                        echo "❌ Health check failed: ${e.message}"
                        bat "docker logs inventory-frontend || echo No frontend logs"
                        bat "docker logs inventory-backend || echo No backend logs"
                        bat "docker logs inventory-mongodb || echo No mongodb logs"
                        bat "docker logs inventory-prometheus || echo No prometheus logs"
                        bat "docker logs inventory-grafana || echo No grafana logs"
                        throw e
                    }
                }
            }
        }
    }

    // After pipeline finished
    post {
        success {
            script {
                def frontendPort = env.FRONTEND_PORT ?: '80'
                def backendPort = env.BACKEND_PORT ?: '5000'
                def mongoPort = env.MONGODB_PORT ?: '27017'
                def prometheusPort = env.PROMETHEUS_PORT ?: '9090'
                def grafanaPort = env.GRAFANA_PORT ?: '3001'
                def nodePort = env.NODE_EXPORTER_PORT ?: '9100'
                def cadvisorPort = env.CADVISOR_PORT ?: '8081'
                
                echo "======================================================"
                echo "✅ FULL-STACK APP WITH MONITORING DEPLOYED SUCCESSFULLY"
                echo "🌐 Frontend: http://localhost:${frontendPort}"
                echo "🚀 Backend API: http://localhost:${backendPort}"
                echo "🗄️ MongoDB: localhost:${mongoPort}"
                echo "📊 Prometheus: http://localhost:${prometheusPort}"
                echo "📈 Grafana: http://localhost:${grafanaPort} (admin/admin)"
                echo "📡 Node Exporter: http://localhost:${nodePort}"
                echo "🐳 cAdvisor: http://localhost:${cadvisorPort}"
                echo "======================================================"
            }
        }
        failure {
            echo "❌ PIPELINE FAILED"
            bat "docker ps -a"
            bat "docker logs inventory-frontend || echo No frontend logs"
            bat "docker logs inventory-backend || echo No backend logs"
            bat "docker logs inventory-mongodb || echo No mongodb logs"
            bat "docker logs inventory-prometheus || echo No prometheus logs"
            bat "docker logs inventory-grafana || echo No grafana logs"
            bat "docker logs inventory-node-exporter || echo No node-exporter logs"
            bat "docker logs inventory-cadvisor || echo No cadvisor logs"
        }
    }
}
