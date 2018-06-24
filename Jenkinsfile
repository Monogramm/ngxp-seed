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
      }
    }
    stage('Install') {
      steps {
        sh '''sdkmanager "tools" "platform-tools" "platforms;android-26" "build-tools;26.0.3" "extras;android;m2repository" "extras;google;m2repository"
npm run ngxp-install'''
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