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


var getGame = function(user_id, callback) {
  console.log("GET GAME! + " + user_id);
  connection.query('SELECT game.roomID as ROOM_ID, game.id as MATCH_ID, u1.id as PLAYER1ID, u2.id as PLAYER2ID, u1.username as PLAYER1, u2.username as PLAYER2, game.turn as TURN, game.moves as MOVES, game.red as RED, game.black as BLACK FROM games_users JOIN users u1 ON games_users.player1_ID = u1.id JOIN users u2 ON u2.id = player2_ID JOIN games game ON game.id = games_users.game_ID WHERE u1.id = ? OR u2.id = ? AND games_users.status = ?', [user_id,user_id, 1],function (error, results, fields){
    if (error) throw error;
      callback(results);
  });
}
var authenticate = function(username, password, callback) {
  connection.query('SELECT * FROM users WHERE username = ' + connection.escape(username), function (error, results, fields) {
    if (error) throw error;
    if(results.length) {
      bcrypt.compare(password,results[0].password, function(err, authenticated) { 
        if(authenticated) {
          callback(results[0]);
        } else {
          callback(false);
        }
    });
    }
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
  let turn = Math.floor(Math.random() * 2) + 1,
      red = Math.floor(Math.random() * 2) + 1,
      black = red === 1 ? 2 : 1;
  connection.query('INSERT INTO games SET ?', {roomID, turn_time: parseInt(turn_time), messages: "", moves: "", red: red, black: black, turn: turn}, function (error, results, fields) {
    if (error) {
      console.log(error);
      callback(false);
    } else {
      let matchID = results.insertId;
      connection.query('INSERT INTO games_users SET ?', {game_ID: results.insertId, player1_ID: player_id, status: 2}, function (error, results, fields) {
        if (error) {
          console.log(error);
          callback(false);
        } else {
          callback(true, matchID);
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

var insertMove = function(match_id, moves, changeTurn, res) {
  let turn;
  connection.query('SELECT * from games WHERE id = ?', [match_id], function (error, results, fields) {
    if(changeTurn) {
      turn = results[0].turn === "player1" ? 2 : 1;
    } else {
      turn = results[0].turn;
    }
    console.log("turn je ");
    console.log(turn);
    connection.query('UPDATE games SET moves = ?, turn = ? WHERE id = ?', [moves, turn, match_id], function (error, results, fields) {
      if(!error) {
        res(true);
      } else {
        res(false);
      }
    });
  });
  
}

module.exports.insertMove = insertMove;
module.exports.getGame = getGame;
module.exports.deleteRoom = deleteRoom;
module.exports.joinMatch = joinMatch;
module.exports.getAllGames = getAllGames;
module.exports.create_match = create_match;
module.exports.insert_user = insert_user;
module.exports.authenticate = authenticate;
module.exports.getPlayers = getPlayers;