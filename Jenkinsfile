#!/usr/bin/env groovy

pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    parameters {
        string(name: 'IMAGE_NAME', defaultValue: 'ngxp-seed', description: 'Docker Image name.')

        string(name: 'DOCKER_TAG', defaultValue: 'latest', description: 'Docker Image tag.')

        choice(name: 'VARIANT', choices: ['alpine'], description: 'Docker Image variant.')

        choice(name: 'BUILD_ENV', choices: ['prod'], description: 'Build target environment.')

        //choice(name: 'BUILD_LOCALE', choices: ['fr', 'en'], description: 'Build target locale.')

        //password(name: 'BUILD_SECRET', defaultValue: 'secret', description: 'Build target secret (shared with backend).')

        //credentials(name: 'NEXUS_CREDENTIALS', credentialType: 'Username with password', description: 'Nexus credentials to pull private libraries.')

        string(name: 'DOCKER_REGISTRY', defaultValue: 'registry-1.docker.io', description: 'Docker Registry to publish the result image to.')

        credentials(name: 'DOCKER_CREDENTIALS', credentialType: 'Username with password', required: true, description: 'Docker credentials to push on the Docker registry.')
    }
    triggers {
        // Daily build, at 5 AM (server time), every business day
        cron('H 5 * * 1-5')
    }
    stages {
        stage('pending') {
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'pending'
            }
        }

        stage('check docker') {
            steps {
                sh "docker --version"
                sh "docker-compose --version"
            }
        }

        stage('build web') {
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS}") {
                        def customImage = docker.build(
                            "${DOCKER_REGISTRY}/${IMAGE_NAME}:${DOCKER_TAG}",
                            "--build-arg TAG=${DOCKER_TAG} --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg BUILD_DATE=`date -u +'%Y-%m-%dT%H:%M:%SZ'` -f Dockerfile.web ."
                        )

                        customImage.push()
                        customImage.push("${VARIANT}")
                    }
                }
            }
        }
    }
    post {
        always {
            // Always cleanup after the build.
            sh 'docker image prune -f --filter until=$(date -d "yesterday" +%Y-%m-%d)'
        }
        success {
            updateGitlabCommitStatus name: 'jenkins', state: 'success'
        }
        failure {
            updateGitlabCommitStatus name: 'jenkins', state: 'failed'
        }
    }
}
