# daigouge.com

The brand new daigouge.com

# Start locally

```
export MONGO_DB_URL='mongodb://<user>:<password>@dharma.mongohq.com:10000/your-db'
node app
# Or use nodemon to automatically restart the app upon file changes
nodemon app
```

# Deploy to Heroku

```
git add remote heroku <heroku_git>
git push heroku master
heroku config:set MONGO_DB_URL='mongodb://<user>:<password>@dharma.mongohq.com:10000/your-db'
```
