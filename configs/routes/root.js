module.exports = function(app) {
  app.all('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });
};
