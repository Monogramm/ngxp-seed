#!/bin/bash

function log() {
    echo "[$0] [$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"
}

function generateKeys() {
    log 'Generate Self-Signed certificate...'

    mkdir -p ./nginx/keys/

    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/keys/server.key -out ./nginx/keys/server.crt -config ./nginx/localhost.conf

}

function install {
    log 'Install locally...'

    node --version
    npm --version

    npm install -g @angular/cli@9
    ng --version

    npm install -g nativescript@6
    tns --version

    npm run ngxp-install
}

function run {
    if [ ! -d 'web/src/x-shared' ]; then
        install
    fi

    log 'Run Web frontend locally...'
    npm run start
}

function prepare-release() {
    NEW_VERSION=${1}
    if [ -z "${NEW_VERSION}" ] ; then
        log 'Missing release version!'
        return 1;
    fi
    #NEW_VERSION=$(grep '"version"' package.json  | cut -d'"' -f4)

    log 'Updating Node and Service Worker app version...'
    sed -i \
        -e "s|\"appData\": \".*\",|\"appData\": \"Release ${NEW_VERSION}\",|g" \
        web/ngsw-config.json
    sed -i \
        -e "s|\"version\": \".*\",|\"version\": \"${NEW_VERSION}\",|" \
        package.json web/package.json nativescript/package.json
    sed -i \
        -e "s| VERSION=.*| VERSION=${NEW_VERSION}|g" \
        .travis.yml Dockerfile.web Dockerfile.android

}

function release() {
    VERSION=${1}
    if [ -z "${VERSION}" ] ; then
        log 'Missing release version!'
        return 1;
    fi

    git branch -a | grep -q " develop$" || {
      git checkout -b develop origin/develop
    }
    git checkout develop && git pull || exit 2
    prepare-release "${VERSION}"
    git add ngsw-config.json **/package.json
    git commit -m ":bookmark: Release ${VERSION}"
    echo "Version ${VERSION} is now HEAD of develop."
    git push
    git checkout master && git pull || exit 2
    git merge develop && git tag "${VERSION}"
    echo "Version ${VERSION} is now HEAD of master and tagged if all went well."
    echo "Please double check and amend last commit if needed."
    echo "Finally, push the release to remote master branch:"
    echo "  $ git push"
    echo "  $ git push origin ${VERSION}"
}

function init_compose {
    if [ ! -f '.env' ]; then
        log 'Init docker compose environment variables...'
        cp .env_template .env
    fi

    export VARIANT=${VARANT:-web}
    export DOCKER_REPO=${DOCKER_REPO:-monogramm/ngxp-seed}
    export DOCKERFILE_PATH=Dockerfile.${VARIANT}
    export DOCKER_TAG=${DOCKER_TAG:-${VARIANT}}

    if [ -n "${DOCKER_REGISTRY}" ]; then
        export IMAGE_NAME=${DOCKER_REGISTRY}/${DOCKER_REPO}:${DOCKER_TAG}
    else
        export IMAGE_NAME=${DOCKER_REPO}:${DOCKER_TAG}
    fi
}

function compose {
    init_compose

    docker-compose \
        -f docker-compose.test.yml \
        "$@"
}

function compose_config {
    init_compose "$@"

    docker-compose \
        -f docker-compose.test.yml \
        config
}

function compose_build {
    compose build "$@"
}

function compose_ps {
    compose ps "$@"
}

function compose_logs {
    compose logs -f "$@"
}

function compose_run {
    compose run "$@"
}

function compose_up {
    compose up -d "$@"
}

function compose_down {
    compose down "$@"
}

function compose_start {
    compose start "$@"
}

function compose_stop {
    compose stop "$@"
}

function compose_restart {
    compose restart "$@"
}

function usage {
    echo "Simple tools to help development and release"
    echo "USAGE: $0 <command> [arguments]"
    echo "
Commands:
    keys [alias password]        Generate SSL cert for local env
    install                      Install NGXP locally
    run                          Run locally
    prepare-release              Prepare release locally
    compose-config               Docker-compose: init env var and check docker-compose file config
    compose-ps                   Docker-compose: list services
    compose-logs                 Docker-compose: follow logs
    compose-build                Docker-compose: build containers
    compose-run                  Docker-compose: run command
    compose-up                   Docker-compose: Create and start containers
    compose-down                 Docker-compose: Stop and remove containers
    compose-start                Docker-compose: Start containers
    compose-stop                 Docker-compose: Stop containers
    compose-restart              Docker-compose: Restart containers
    "
}


case $1 in
    keys)
        generateKeys "${@:2}"
        ;;
    install)
        install "${@:2}"
        ;;
    run)
        run "${@:2}"
        ;;
    prepare-release)
        prepare-release "${@:2}"
        ;;
    compose-config)
        compose_config "${@:2}"
        ;;
    compose-build)
        compose_build "${@:2}"
        ;;
    compose-ps)
        compose_ps "${@:2}"
        ;;
    compose-logs)
        compose_logs "${@:2}"
        ;;
    compose-run)
        compose_run "${@:2}"
        ;;
    compose-up)
        compose_up "${@:2}"
        ;;
    compose-down)
        compose_down "${@:2}"
        ;;
    compose-start)
        compose_start "${@:2}"
        ;;
    compose-stop)
        compose_stop "${@:2}"
        ;;
    compose-restart)
        compose_restart "${@:2}"
        ;;
    *)
        usage
        ;;
esac
