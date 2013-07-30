# daigouge.com

The brand new daigouge.com

# Clone & setup

```
git clone git@github.com:gregwym/daigouge.git
npm install
```

If you want to modify and `make` the components yourself, you need to install [component](https://github.com/component/component) globally.

```
npm install -g component
make
```

# Start locally

```
export MONGO_DB_URL='mongodb://<user>:<password>@dharma.mongohq.com:10000/your-db'
NODE_PATH=server node app.js
```

Or use nodemon to automatically restart the app upon server file changes:

```
NODE_PATH=server nodemon -w server -w *.js app.js
```

If you are working on the front-end, add `-b` option to build the components upon each request:

```
NODE_PATH=server node app.js -b
# or
NODE_PATH=server nodemon -w server -w *.js app.js -b
```

# Deploy to Heroku

```
git add remote heroku <heroku_git>
git push heroku master
heroku config:set MONGO_DB_URL='mongodb://<user>:<password>@dharma.mongohq.com:10000/your-db'
```
