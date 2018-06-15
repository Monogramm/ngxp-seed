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
        sh '#ng --version'
        sh 'tns info'
        sh 'java -version'
        sh '#android --version'
      }
    }
    stage('Install') {
      steps {
        sh 'npm run ngxp-install'
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