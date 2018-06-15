pipeline {
  agent {
    docker {
      image 'monogramm/docker-ngxp'
    }

  }
  stages {
    stage('Init') {
      steps {
        sh 'node --version'
        sh 'tns info'
        sh 'java -version'
        sh 'android --version'
      }
    }
    stage('Build') {
      parallel {
        stage('Build Web') {
          steps {
            sh 'npm run build'
          }
        }
        stage('Build Mobile') {
          steps {
            sh 'npm run build.android'
            archiveArtifacts '*.apk'
          }
        }
      }
    }
  }
}