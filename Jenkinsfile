#!/usr/bin/env groovy

pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    parameters {
        string(name: 'DOCKER_REPO', defaultValue: 'ngxp-seed', description: 'Docker Image name.')

        string(name: 'DOCKER_TAG', defaultValue: 'latest', description: 'Docker Image tag.')

        choice(name: 'VARIANT', choices: ['web'], description: 'Docker Image variant.')

        choice(name: 'BUILD_ENV', choices: ['prod'], description: 'Build target environment.')

        choice(name: 'CLIENT_LOCALE', choices: ['en', 'fr'], description: 'Client target locale.')

        credentials(name: 'API_WEB_CREDENTIALS', credentialType: 'Username with password', required: true, description: 'Web Client API credentials.')

        //credentials(name: 'PACKAGE_REPO_CREDENTIALS', credentialType: 'Username with password', required: true, description: 'Private Package Repository credentials to pull packages.')

        string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'Docker Registry to publish the result image to. Leave empty for DockerHub.')

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
                sh "docker info"
            }
        }

        stage('build-hooks') {
            environment {
                //PACKAGE_REPO_CREDS = credentials("${PACKAGE_REPO_CREDENTIALS}")
                API_CREDS = credentials("${API_CREDENTIALS}")
            }
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                sh 'export API_WEB_CLIENT_ID=${API_CREDS_USR}; export API_WEB_CLIENT_SECRET=${API_CREDS_PSW}; export PACKAGE_REPO_LOGIN=${PACKAGE_REPO_CREDS_USR}; export PACKAGE_REPO_PASSWORD=${PACKAGE_REPO_CREDS_PSW}; ./hooks/run build "${VARIANT}"'
            }
        }

        stage('test-hooks') {
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                sh './hooks/run test "${VARIANT}"'
            }
        }

        stage('push-hooks') {
            environment {
                DOCKER_CREDS = credentials("${DOCKER_CREDENTIALS}")
            }
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                // Write Docker image tags to push
                sh '([ "${DOCKER_TAG}" = "latest" ] && echo "${VARIANT} " || echo "${DOCKER_TAG}-${VARIANT} ") > .dockertags'
                // Export variables to login and push to Docker Registry
                sh 'export DOCKER_LOGIN=${DOCKER_CREDS_USR}; export DOCKER_PASSWORD=${DOCKER_CREDS_PSW}; ./hooks/run push "${VARIANT}"'
                sh 'rm -f .dockertags'
            }
        }

        stage('build-hooks') {
            environment {
                NEXUS_CREDS = credentials("${NEXUS_CREDENTIALS}")
                API_CREDS = credentials("${API_CREDENTIALS}")
            }
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                sh 'export API_WEB_CLIENT_ID=${API_CREDS_USR}; export API_WEB_CLIENT_SECRET=${API_CREDS_PSW}; export NEXUS_LOGIN=${NEXUS_CREDS_USR}; export NEXUS_PASSWORD=${NEXUS_CREDS_PSW}; ./hooks/run build "${VARIANT}"'
            }
        }

        stage('test-hooks') {
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                sh './hooks/run test "${VARIANT}"'
            }
        }

        stage('push-hooks') {
            environment {
                DOCKER_CREDS = credentials("${DOCKER_CREDENTIALS}")
            }
            steps {
                updateGitlabCommitStatus name: 'jenkins', state: 'running'

                // Write Docker image tags to push
                sh '([ "${DOCKER_TAG}" = "latest" ] && echo "${VARIANT} " || echo "${DOCKER_TAG}-${VARIANT} ") > .dockertags'
                // Export variables to login and push to Docker Registry
                sh 'export DOCKER_LOGIN=${DOCKER_CREDS_USR}; export DOCKER_PASSWORD=${DOCKER_CREDS_PSW}; ./hooks/run push "${VARIANT}"'
                sh 'rm -f .dockertags'
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
