var mongoose = require('mongoose');

// Initialize MongoDB connection.
module.exports = function() {
  var mongoUrl = process.env.MONGO_DB_URL || 'mongodb://localhost/mydb';
  mongoose.connect(mongoUrl);
  console.log("Mongoose connected to " + mongoUrl);
};
