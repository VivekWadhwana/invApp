pipeline {
    agent any

    tools {
        nodejs "node"
    }

    environment {
        DOCKER_USER = "vivek170205"
        IMAGE_NAME = "vite-app"
        SONAR_AUTH_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat "npm install"
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
                        -Dsonar.projectKey=vite-app ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=%SONAR_AUTH_TOKEN%
                        """
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t %DOCKER_USER%/%IMAGE_NAME% ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "docker login -u %USER% -p %PASS%"
                }
            }
        }

        stage('Docker Push') {
            steps {
                bat "docker push %DOCKER_USER%/%IMAGE_NAME%:latest"
            }
        }

        stage('Stop Previous Container') {
            steps {
                bat "docker rm -f vite-container || exit 0"
            }
        }

        stage('Docker Run') {
            steps {
                bat "docker run -d -p 8080:80 --name vite-container %DOCKER_USER%/%IMAGE_NAME%:latest"
            }
        }
    }
}
