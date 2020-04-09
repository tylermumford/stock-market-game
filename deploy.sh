#!/bin/zsh
set -e

echo 'Deploying Stock Market Game...'
DEPLOY_PATH=stocks
PATH_IN_TARGET_REPO=~/dev/tylermumford.github.io/$DEPLOY_PATH

echo $PATH_IN_TARGET_REPO

cd app
ng build --prod --outputPath=$PATH_IN_TARGET_REPO --deployUrl=/$DEPLOY_PATH/ --baseHref=/$DEPLOY_PATH/

cd $PATH_IN_TARGET_REPO
git add .
git commit -m 'Deploy Stock Market Game (deploy.sh)'
git push
