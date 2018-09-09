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
  connection.query("SELECT * FROM users", function(error, results, fields) {
    if (error) throw error;
    callback(results.length);
  });
}

var joinMatch = function(player2_id, match_id, callback) {
      connection.query('UPDATE games_users SET player2_ID = ?, status = ? WHERE game_ID = ?', [player2_id, 1, match_id], function (error, results, fields) {
        if (error) {
          console.log(error);
          callback(false);
        } else {
          connection.query("SELECT * FROM games WHERE id = ? ",[match_id], function(error, results, fields) {
            if(error) {
              callback(false);
            } else {
              callback(true, results[0].roomID);
            }
          });
        }
      });
}

var create_match = function(player_id, roomID, turn_time, callback) {
  connection.query('INSERT INTO games SET ?', {roomID, turn_time: parseInt(turn_time), messages: "", moves: ""}, function (error, results, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else {
      connection.query('INSERT INTO games_users SET ?', {game_ID: results.insertId, player1_ID: player_id, status: 2}, function (error, results, fields) {
        if (error) {
          console.log(error);
          callback(false);
        } else {
          callback(true);
        }
      });
    }
  });
}

var getAllGames = function(callback) {
  console.log("get all games!");
  connection.query('SELECT * from games INNER JOIN games_users ON games_users.game_ID = games.id INNER JOIN users ON games_users.player1_ID = users.id WHERE games_users.status = 2', function(error, results, fields){
    if (error) throw error;
    callback(results);
  });
}

var deleteRoom = function(player_id, callback) {
  connection.query('DELETE game FROM games game INNER JOIN games_users gu ON game.id = gu.game_ID WHERE gu.player1_ID = ? AND gu.status = ?',[player_id, 2], function (error, results, fields) {
    if (error) {
      callback(false)
    } else {
      callback(results.affectedRows);
    }
  });
}

module.exports.deleteRoom = deleteRoom;
module.exports.joinMatch = joinMatch;
module.exports.getAllGames = getAllGames;
module.exports.create_match = create_match;
module.exports.insert_user = insert_user;
module.exports.authenticate = authenticate;
module.exports.getPlayers = getPlayers;