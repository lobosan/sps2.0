# SCENARIO PLANNING SYSTEM 2.0

## Install dependencies
```
meteor npm install
```

## Run development environment
```
meteor npm run dev
```

## Update all packages
```
meteor update --all-packages
```

## Check meteor node version
```
meteor node -v
```

## Add remote environments
```
git remote add staging https://git.heroku.com/staging-spsys.git
git remote add live https://git.heroku.com/spsys.git
git remote -v
```

## Deployment
```
git push origin master
git push staging master
git push live master
```
