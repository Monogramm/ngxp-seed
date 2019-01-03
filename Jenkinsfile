pipeline {
  agent {
    docker {
      image 'monogramm/docker-ngxp'
      args '-u root:root'
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
npm run install'''
      }
    }
    stage('Build') {
      parallel {
        stage('Build Web') {
          steps {
            sh 'npm run build'
            sh 'npm run build.android'
          }
        }
        stage('Build Mobile') {
          steps {
            sh 'npm run build.android'
            archiveArtifacts(artifacts: 'nativescript/platforms/android/build/outputs/apk/*.apk', onlyIfSuccessful: true)
          }
        }
      }
    }
  }
}
