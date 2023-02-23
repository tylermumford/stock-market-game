build: && clean
  npx ng build

[no-exit-message]
@clean:
  echo 'cleaning dist dir'
  git clean --force --quiet dist
  git restore dist

deploy: clean
  npx ng build --configuration production
  git add dist
  git commit -m "(prod build)"
