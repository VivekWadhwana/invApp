pipeline {

    // Jenkins can run on any agent (Windows/Linux)
    agent any

    // Environment variables
    environment {
        DOCKER_USER = "vivek170205"
        FRONTEND_IMAGE = "inventory-frontend"
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

        // 2️⃣ Install Dependencies
        stage('Install Dependencies') {
            steps {
                bat "npm install"
            }
        }

        // 3️⃣ Build Frontend
        stage('Build Frontend') {
            steps {
                bat "npm run build"
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
                            bat """
                            rem translate localhost -> host.docker.internal for container access
                            set "SCANNER_HOST=%SONAR_HOST_URL:localhost=host.docker.internal%"
                            docker run --rm ^
                                -e SONAR_HOST_URL=%SCANNER_HOST% ^
                                -e SONAR_LOGIN=%SONAR_TOKEN% ^
                                -v %WORKSPACE%:/usr/src ^
                                sonarsource/sonar-scanner-cli ^
                                -Dsonar.projectKey=inventory-frontend ^
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

        // 5️⃣ Build Docker Image
        stage('Docker Build') {
            steps {
                bat "docker build -t %DOCKER_USER%/%FRONTEND_IMAGE%:latest ."
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

        // 7️⃣ Push Docker Image
        stage('Docker Push') {
            steps {
                bat "docker push %DOCKER_USER%/%FRONTEND_IMAGE%:latest"
            }
        }

        // 8️⃣ Stop Old Containers
        stage('Stop Old Containers') {
            steps {
                bat """
                docker compose down --remove-orphans || echo No containers
                docker container rm inventory-frontend inventory-prometheus inventory-grafana inventory-node-exporter inventory-cadvisor -f || echo No old containers
                """
            }
        }

        // 9️⃣ Deploy Frontend with Monitoring
        stage('Deploy Frontend Stack') {
            steps {
                script {
                    // Check and assign available ports
                    powershell """
                    function Test-Port {
        pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                bat "npm install"
                bat "npm run build"
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
                bat "docker compose up -d frontend"
                bat "timeout /t 10 /nobreak"
            }
        }
    }
    
    post {
        success {
            echo "✅ Frontend deployed: http://localhost:80"
        }
        failure {
            bat "docker ps -a"
        }
    }
}
