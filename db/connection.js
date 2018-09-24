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

var stats = function(callback) {
  connection.query('SELECT * from games JOIN games_users ON games_users.game_ID = games.id JOIN users ON users.id = games_users.player_id GROUP BY games.id', function(error, results, fields) {
    if(error) throw error;
      callback(results);
  });
}

var getGame = function(match_id, callback) {
  console.log("GET GAME! + " + match_id);
  connection.query('SELECT * FROM games_users JOIN users u ON games_users.player_id = u.id JOIN games game ON game.id = games_users.game_ID WHERE games_users.game_ID = ? AND games_users.status', [match_id, 1],function (error, results, fields){
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
      connection.query('INSERT INTO games_users SET player_id = ?, status = ?, game_ID = ?', [player2_id, 1, match_id], function (error, results, fields) {
        if (error) {
          console.log(error);
          callback(false);
        } else {
          connection.query("UPDATE games_users SET status = 1 WHERE game_ID = ?", [match_id], function(error, results, fields){
            connection.query("SELECT * FROM games WHERE id = ? ",[match_id], function(error, results, fields) {
              if(error) {
                callback(false);
              } else {
                callback(true, results[0].roomID);
              }
            });
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
      connection.query('INSERT INTO games_users SET ?', {game_ID: results.insertId, player_id: player_id, status: 2}, function (error, results, fields) {
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
  connection.query('SELECT * from games INNER JOIN games_users ON games_users.game_ID = games.id INNER JOIN users ON games_users.player_id = users.id WHERE games_users.status = 2', function(error, results, fields){
    if (error) throw error;
    callback(results);
  });
}

var deleteRoom = function(player_id, callback) {
  connection.query('DELETE game FROM games game INNER JOIN games_users gu ON game.id = gu.game_ID WHERE gu.player_id = ? AND gu.status = ?',[player_id, 2], function (error, results, fields) {
    if (error) {
      callback(false)
    } else {
      callback(true);
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

var insertMessage = function(match_id, message) {
  console.log("insert move ! " + match_id + " " + message);
  connection.query('UPDATE games SET messages = ? WHERE id = ?',[message, parseInt(match_id)], function(error, results, fields){
    if (error) throw error;
  });
}

var getMessages = function(match_id, callback) {
  connection.query('SELECT messages from games WHERE id = ?', [match_id], function(error, results, fields){
      console.log(results[0]);
      callback(results[0].messages);
  });
}

var insertGameWinner = function(match_id, winner) {
  connection.query('SELECT * from games g INNER JOIN games_users gu ON gu.game_ID = g.id INNER JOIN users ON users.id = gu.player_id WHERE g.id = ?', [match_id], function(error, results, fields) {
    if (error) throw error;
    console.log("insertGameWinner " + match_id);
    let winnerUsername;
    if (winner === "player1") {
        winnerUsername = results[0].username;
    } else {
        winnerUsername = results[1].username;
    }
    connection.query('UPDATE games_users SET winner = ?, status = ? WHERE game_ID = ?', [winnerUsername, 3, match_id], function(error, results, fields) {
      if (error) throw error;
      console.log("insertGameWinner");
      console.log(results);
    });
  });
}

var changeTurn = function(match_id) {
  connection.query('SELECT turn FROM games WHERE id = ?', [match_id], function(error, results, fields){
      let turn = results.turn === 'player1' ? 2 : 1;
      connection.query('UPDATE games SET ? WHERE id = ' + connection.escape(match_id), {turn}, function (error, results, fields) {
          if(error) throw error;
      });
  });
}

var getMatchID = function(user_id, callback) {
  connection.query('SELECT game_ID FROM games_users WHERE player_id = ? AND status = ?', [user_id, 1], function(error, results, fields){
      console.log("getMatchID");
      console.log(results[0]);
      callback(results[0].game_ID);
  });
}

var getPlayer = function(user_id) {
  connection.query("SELECT * from users WHERE id = ?", [user_id], function(error, results, fields){
      
  });
}

var getNumberOfGames = function(callback) {
  connection.query("SELECT COUNT(id) AS numberOfMatches FROM games", function(error, results, fields){
      callback(results);
  });
}

module.exports.stats = stats;
module.exports.getNumberOfGames = getNumberOfGames;
module.exports.getMessages = getMessages;
module.exports.insertMessage = insertMessage;
module.exports.getMatchID = getMatchID;
module.exports.insertGameWinner = insertGameWinner;
module.exports.changeTurn = changeTurn;
module.exports.insertMove = insertMove;
module.exports.getGame = getGame;
module.exports.deleteRoom = deleteRoom;
module.exports.joinMatch = joinMatch;
module.exports.getAllGames = getAllGames;
module.exports.create_match = create_match;
module.exports.insert_user = insert_user;
module.exports.authenticate = authenticate;
module.exports.getPlayers = getPlayers;