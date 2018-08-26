var mysql = require("mysql");
var bcrypt = require('bcrypt');

const saltRounds = 10;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "reactnode"
});

connection.connect();

var insert_user = function(username, email, password, callback) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        connection.query('INSERT INTO users SET ?', {username: username, email: email, password: hash}, function (error, results, fields) {
          if (error) {
            console.log(error);
            callback({
              message: 'Duplicate username or email !',
              success: false
            });
          } else {
            callback({
              message: 'Successfuly registered. Have fun playing !',
              success: true
            });
          }
        });
    });
  });
  
};

var authenticate = function(username, password, callback) {
  connection.query('SELECT * FROM users WHERE username = ' + connection.escape(username), function (error, results, fields) {
    if (error) throw error;
    callback(results[0]);
  });
}

module.exports.insert_user = insert_user;
module.exports.authenticate = authenticate;