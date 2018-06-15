pipeline {
  agent none
  stages {
    stage('Init') {
      agent {
        docker {
          image 'monogramm/docker-ngxp'
        }

      }
      steps {
        sh 'ng --version'
        sh 'tns info'
        sh 'java -version'
        sh 'android --version'
      }
    }
    stage('Build') {
      parallel {
        stage('Build Web') {
          agent {
            docker {
              image 'monogramm/docker-ngxp'
            }

          }
          steps {
            sh 'npm run build'
          }
        }
        stage('Build Mobile') {
          agent {
            docker {
              image 'monogramm/docker-ngxp'
            }

          }
          steps {
            sh 'npm run build.android'
            archiveArtifacts '*.apk'
          }
        }
      }
    }
  }
}