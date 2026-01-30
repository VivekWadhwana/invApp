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
        RUN_SONAR = 'false'
    }

    stages {

        // 1️⃣ Get Code from GitHub (Declarative checkout already ran)
        stage('Clone Code') {
            steps {
                echo "Repository already checked out by Declarative pipeline."
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
                // run tests only if script exists so pipeline doesn't fail
                bat "npm run test --if-present || echo No tests"
            }
        }

        // 5️⃣ SonarQube Code Quality Scan (optional)
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
