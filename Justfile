build: && clean
  npm run ng -- build --verbose

@clean:
  @echo 'cleaning dist dir'
  git clean -f dist
  git restore dist

prod: clean
  npm run ng -- build --configuration production
  git add dist
  git commit -m "(prod build)"
