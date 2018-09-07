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

var insert_user = function(username, email, password, about, callback) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        connection.query('INSERT INTO users SET ?', {username: username, email: email, password: hash, about: about, MMR: 1000}, function (error, results, fields) {
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

var getPlayers = function(callback) {
  connection.query("SELECT * FROM USERS", function(error, results, fields) {
    if (error) throw error;
    callback(results.length);
  });
}

var updatePlayer = function(username, email, newpassword, about, callback) {
    connection.query('UPDATE users SET username = ?, password = ?, email = ?, about = ? WHERE username = ?', [username, newpassword, email, about,  username], function (error, results, fields) {
      if (error) throw error;

    });
}

module.exports.insert_user = insert_user;
module.exports.authenticate = authenticate;
module.exports.getPlayers = getPlayers;