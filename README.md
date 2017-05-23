# SCENARIO PLANNING SYSTEM 2.0

## Run development environment
```
meteor npm run dev
```

## Update all packages
```
meteor update --all-packages
```

## Install Heroku CLI
```
sudo apt-get install software-properties-common
sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install heroku
```

## Add remote environments
```
git remote add staging https://git.heroku.com/staging-spsys.git
git remote add live https://git.heroku.com/spsys.git
git remote -v
```

## Deployment
```
git push staging master
git push live master
```