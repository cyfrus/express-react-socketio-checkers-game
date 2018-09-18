var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const crypto = require('crypto');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require('./db/connection');


function jumps(row, square, move, boardState, turn) {
  let moves = [], deleted = [], result;
  if (!outOfBoard(row + 2, square + 2) && turn === "black" && boardState[row + 1][square + 1].pieceColor === "red" && !boardState[row + 2][square + 2].piece) {
    moves.push({ row: row + 2, square: square + 2 });
    deleted.push({ row: row + 1, square: square + 1 });
  }
  if (!outOfBoard(row + 2, square - 2) && turn === "black" && boardState[row + 1][square - 1].pieceColor === "red" && !boardState[row + 2][square - 2].piece) {
    moves.push({ row: row + 2, square: square - 2 });
    deleted.push({ row: row + 1, square: square - 1 });
  }
  if (!outOfBoard(row - 2, square - 2) && turn === "red" && boardState[row - 1][square - 1].pieceColor === "black" && !boardState[row - 2][square - 2].piece) {
    moves.push({ row: row - 2, square: square - 2 });
    deleted.push({ row: row - 1, square: square - 1 });
  }
  if (!outOfBoard(row - 2, square + 2) && turn === "red" && boardState[row - 1][square + 1].pieceColor === "black" && !boardState[row - 2][square + 2].piece) {
    moves.push({ row: row - 2, square: square + 2 });
    deleted.push({ row: row - 1, square: square + 1 });
  }
  console.log(moves);
  moves.forEach((element, index) => {
    if (element.row === move.row && element.square === move.square) {
      result = deleted[index];
    }
  });
  console.log("rezultat skokova je: " + result);
  return result;
}

function outOfBoard(row, square) {
  if(row > 7 || row < 0 || square < 0 || square > 7) {
      return true;
  } 
  return false;
}

function availableMoves(row, square, move, boardState, turn) {
  let moves = [];

  if(boardState[row][square].pieceColor === "red" && turn === "red"){
       if(!outOfBoard(row - 1, square - 1) && !boardState[row - 1][square - 1].piece) {
        moves.push({row: row - 1, square: square - 1});
       }
       if(!outOfBoard(row - 1, square + 1) && !boardState[row - 1][square + 1].piece){
          moves.push({row: row - 1, square: square + 1});
       }
  } else if(boardState[row][square].pieceColor === "black" && turn === "black") {
      if(!outOfBoard(row + 1, square + 1) && !boardState[row + 1][square + 1].piece) {
          moves.push({row: row + 1, square: square + 1});
       }
       if(!outOfBoard(row + 1, square - 1) && !boardState[row + 1][square - 1].piece){
          moves.push({row: row + 1, square: square - 1});
       }
  }

  if(moves.find(element => {
      return element.row === move.row &&  element.square === move.square;
  })) {
    return true;
  }
  return false;
}

function gameOver(boardState) {
  console.log("game over function!");
    var gameOver = "", redCount = 0, blackCount = 0, blackMoveCount = 0, redMoveCount = 0;
    boardState.forEach((row, rowIndex) => {
      row.forEach((square, squareIndex) => {
          if(square.piece && square.pieceColor === "black") {
            blackCount++;
            blackMoveCount += getAvailableMoves(rowIndex, squareIndex, boardState);
          } else if(square.piece && square.pieceColor === "red") {
            redCount++;
            redMoveCount += getAvailableMoves(rowIndex, squareIndex, boardState);
          }
          
      });
    });
    console.log("number of red moves: " + redMoveCount);
    console.log("number of black moves: " + blackMoveCount);
    console.log("number of black pieces: " + blackCount);
    console.log("number of red pieces: " + redCount);
    if(!redCount || !redMoveCount) {
      gameOver = "black";
    } else if(!blackCount || !blackMoveCount) {
      gameOver = "red";
    }
    return gameOver;
}

function getAvailableMoves (row, square, boardState) {
  let moves = [];
  if(boardState[row][square].pieceColor === "red"){
    if(!outOfBoard(row - 1, square - 1) && !boardState[row - 1][square - 1].piece) {
     moves.push({row: row - 1, square: square - 1});
    }
    if(!outOfBoard(row - 1, square + 1) && !boardState[row - 1][square + 1].piece){
       moves.push({row: row - 1, square: square + 1});
    }
} else if(boardState[row][square].pieceColor === "black") {
   if(!outOfBoard(row + 1, square + 1) && !boardState[row + 1][square + 1].piece) {
       moves.push({row: row + 1, square: square + 1});
    }
    if(!outOfBoard(row + 1, square - 1) && !boardState[row + 1][square - 1].piece){
       moves.push({row: row + 1, square: square - 1});
    }
  }
  return moves.length;
}


function setTheGame() {
  var boardState = [8];
      for(let i = 0; i < 8; i++) {
              boardState[i] = [8];
         for(let z = 0; z < 8; z++){  
             if(((i === 0 || i === 2 || i === 6) && (z % 2)) || ((i === 1 || i === 5 || i === 7) && !(z % 2)))
             {    
                  if(i === 2 || i === 0 || i === 1)
                  boardState[i][z] = {piece: true, pieceColor: "black"};
                  else
                  boardState[i][z] = {piece: true, pieceColor: "red"}
             } else {
                  boardState[i][z] = {piece: false, pieceColor: ""};
             }
             
         }
      }      
      return boardState;
}

function createGame(player_id, roomID, turn_time, callback) {
  db.create_match(player_id, roomID, turn_time, (result, matchID) => {
      if(result) {
        console.log(matchID);
        callback(true, roomID, matchID);
      }
      else {
        callback(false, roomID, matchID);
      }
  });
}

function setGame(result) {
  let game = {
    PLAYER1: result[0].username,
    PLAYER2: result[1].username,
    PLAYER1ID: result[0].player_id,
    PLAYER2ID: result[1].player_id,
    TURN: result[0].turn,
    RED: result[0].red,
    BLACK: result[0].black,
    ROOM_ID: result[0].roomID,
    MOVES: result[0].moves,
    MATCH_ID: result[0].game_ID
  };
  return game;
}

io.on('connection', function (socket) {
  socket.on('checkIfUserIsInTheRoom', function(room){
    console.log("provjera da li je korisnik u sobi!");
    console.log(socket.rooms);
    console.log(room);
    if(!(room in socket.rooms)){
      socket.join(room);
      socket.to(room).emit('reconnected', "opponent reconnected");
    } else {
      console.log("user is in room");
    }
  });
  socket.on('hey', function(data){
    console.log(socket.rooms);
    console.log("hey !" + data.roomID);
    socket.to(data.roomID).emit('hey', "protivnik se pridruzio");
  });

  socket.on('checkMove', function(data){
    db.getGame(data.match_id, (result) => {
     let game = setGame(result),
         moves = game.MOVES,
         boardState = [], canJump, wasLastMoveJump, myTurn = false;
         console.log(data);
        if(!moves) {
          boardState = setTheGame();
        } else {
          boardState = transformTextToMoves(moves);
        }
        canJump = jumps(data.from.row, data.from.square, data.move, boardState, data.color);
        wasLastMoveJump = moves.slice(moves.length-7, moves.length-2) === "DELET" ? true: false;
        if(wasLastMoveJump) {
          let lastMoveColor = moves.slice(moves.length-14, moves.length-13) === "B" ? "black" : "red";
          myTurn = lastMoveColor === data.color ? true : false;
        }
  

        if (!myTurn && availableMoves(data.from.row, data.from.square, data.move, boardState, data.color)) {
            db.insertMove(data.match_id, moves + transformMoveToText(data.from, data.move, data.color), true, inserted => {
              db.getGame(data.match_id, (res) => {
                let updatedState = setGame(res), winner;
                updatedState.MOVES = transformTextToMoves(updatedState.MOVES);
                winner = gameOver(updatedState.MOVES);
                console.log("WINNER JE " + winner);
                if(winner !== "") {
                  console.log("gameOver : " + winner);
                  updatedState.WINNER = winner;
                  updatedState.GAMEOVER = true;
                  db.insertGameWinner(data.match_id, winner);
                } else {
                  updatedState.WINNER = "";
                  updatedState.GAMEOVER = false;
                }
                io.in(data.roomID).emit('updateBoardState', updatedState);
              });
            });
        } else if(canJump) {
          let newMoves, canJumpAgain = false;
          console.log(jumpToText(canJump, data.from, data.move, data.color)); 
          if(data.color === "black") {
            newMoves = [
              {row: data.move.row + 2, square: data.move.square + 2},
              {row: data.move.row + 2, square: data.move.square - 2},
            ];
          } else {
            newMoves = [
              {row: data.move.row - 2, square: data.move.square + 2},
              {row: data.move.row - 2, square: data.move.square - 2}
            ];
          }
          console.log(newMoves);
          newMoves.forEach(nextMove => {
              if(jumps(data.move.row, data.move.square, nextMove.row, nextMove.square, boardState, data.color)) {
                canJumpAgain = true;
              }
          });
          console.log("Can jump again: " + canJumpAgain);
          db.insertMove(data.match_id, moves + jumpToText(canJump, data.from, data.move, data.color), !canJumpAgain, inserted => {
            db.getGame(data.match_id, (res) => {
              let updatedState = setGame(res), winner;
              updatedState.MOVES = transformTextToMoves(updatedState.MOVES);
              winner = gameOver(updatedState.MOVES);
              if(winner !== "") {
                console.log("gameOver");
                updatedState.WINNER = winner;
                updatedState.GAMEOVER = true;
                db.insertGameWinner(data.match_id, winner);
              } else {
                updatedState.WINNER = "";
                updatedState.GAMEOVER = false;
              }
                io.in(data.roomID).emit('updateBoardState', updatedState);
            });
          });
        } else if(gameOver(boardState)) {
          console.log("game is Over!");
        }
    });
    io.in(data.roomID).emit('checkMoveResponse');
  });

  socket.on('rejoinGame', function(data) {
      db.getGame(data.match_id, (result) => {
        if(result.length) {
          socket.join(result[0].ROOM_ID);
          socket.gameRoom = result[0].ROOM_ID;
          socket.to(result[0].ROOM_ID).emit('joined', "opponent joined!");
        }
      })
  });
  
  socket.on('createGame', function(data) {
    socket.player_id = data.id;
    socket.inLobby = true;
    console.log("create game!");
    createGame(data.id, generateRoomName(), data.turn_time, (gameCreated, roomID, matchID) => {
        if(gameCreated) {
          socket.join(roomID);
          socket.gameRoom = roomID;
          db.getAllGames((result) => {
            io.of('/').emit('updateGameList', result);
          });
        }
    });
  });

  socket.on('joinGame', function(data) {
    db.joinMatch(data.user_id, data.match_id, (joinedGame, roomID) => {
      if(joinedGame) {
        socket.join(roomID);
        io.to(roomID).emit('startGame', {roomID, match_id: data.match_id});
        db.getAllGames((result) => {
          io.of('/').emit('updateGameList', result);
        });
        console.log("joined game + match ID:" + data.match_id + " roomID + " + roomID);
      }
    });
  });

  socket.on('deleteLobby', function() {
    console.log("delete lobby!");
    if(socket.inLobby) {
      db.deleteRoom(socket.player_id, (deletedRoom) => {
        if(deletedRoom) {
          db.getAllGames((result) => {
            socket.broadcast.emit('updateGameList', result);
          });
        } else {
          console.log("Nije uspjesno brisanje");
        }
      });
    }
  });

  socket.on('disconnect', function () {
    if(socket.inLobby) {
      db.deleteRoom(socket.player_id, (deletedRoom) => {
        if(deletedRoom) {
          db.getAllGames((result) => {
            socket.broadcast.emit('updateGameList', result);
          });
          console.log(deletedRoom);
        } else {
          console.log("Nije uspjesno brisanje");
        }
      });
    }
    console.log("player disconnected!")
  });

  console.log("player connected!");
});

var transformTextToMoves = function(moves) {
  console.log("moves");
  console.log(moves);
  let boardState = setTheGame(),
      start = 0, end = 7,
      fromRow, fromSquare, toRow, toSquare, color = "";
      
  for(let i = 0; i < moves.length; i = i + 7) {
    let move = moves.slice(start, end);
    if(move.slice(0,1) === "B") {
      color = "black";
    } else {
      color = "red";
    }
    if(move.slice(0, 5) === "DELET") {
      console.log(move);
      console.log("skok!");
      let delRow = move.slice(5,6),
          delSquare = move.slice(6, 7)
      boardState[delRow][delSquare].piece = false;
      boardState[delRow][delSquare].pieceColor = "";
      start = start + 7;
      end = end + 7;
    } else {
      fromRow = parseInt(move.slice(2,3));
      fromSquare = parseInt(move.slice(3, 4));
      toRow = parseInt(move.slice(5,6));
      toSquare = parseInt(move.slice(6,7));
      start = start + 7;
      end = end + 7;
      boardState[toRow][toSquare].piece = true;
      boardState[toRow][toSquare].pieceColor = color;
      boardState[fromRow][fromSquare].piece = false;
      boardState[fromRow][fromSquare].pieceColor = "";
    }
  }
  return boardState;
}

var transformTextToMove = function(moveText) {
    let row, square;
    row = parseInt(moveText.slice(5,6));
    square = parseInt(moveText.slice(6,7));
    return {row, square};
}

var jumpToText = function(deleted, from, to, color) {
  let move = "";
  move = "DELET" + deleted.row.toString() + deleted.square.toString();
  return transformMoveToText(from, to, color) + move;
}

var transformMoveToText = function(from, to, color) {
  let move = "",
      colorPrefix = color === "red" ? "R" : "B";
   move = colorPrefix + "F" + from.row.toString() + from.square.toString() + "T" + to.row.toString() + to.square.toString();
   console.log(move);
   return move;
}

function generateRoomName() {
  var roomId = crypto.randomBytes(20).toString('hex');
  return roomId;
}

app.use(function(req, res, next){
  res.io = io;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};

