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


// function checkJumps(positions, moves, removedPieces, boardState, turn){
//   let newPositions = [],
//       jumpFurther = false;

//   if(!positions.length) {
//       return {moves: moves, removedPieces: removedPieces};
//   }
//   positions.forEach( (position, index) => {
//       if(!outOfBoard(position.row + 2, position.square + 2) && turn === "black" && boardState[position.row + 1][position.square + 1].pieceColor === "red" && !boardState[position.row + 2][position.square + 2].piece) {
//           newPositions.push({row: position.row + 2, square: position.square + 2});
//           moves.push({row: position.row + 2, square: position.square + 2});
//           removedPieces.push({row: position.row + 1, square: position.square + 1});
//           jumpFurther = true;
//       }
//       if(!outOfBoard(position.row + 2, position.square - 2) && turn === "black" && boardState[position.row + 1][position.square - 1].pieceColor === "red" && !boardState[position.row + 2][position.square - 2].piece) {
//           newPositions.push({row: position.row + 2, square: position.square - 2});
//           moves.push({row: position.row + 2, square: position.square - 2});
//           removedPieces.push({row: position.row + 1, square: position.square - 1});
//           jumpFurther = true;
//       }
//       if(!outOfBoard(position.row - 2, position.square - 2) && turn === "red" && boardState[position.row - 1][position.square - 1].pieceColor === "black" && !boardState[position.row - 2][position.square - 2].piece) {
//           newPositions.push({row: position.row - 2, square: position.square - 2});
//           moves.push({row: position.row - 2, square: position.square - 2});
//           removedPieces.push({row: position.row - 1, square: position.square - 1});
//           jumpFurther = true;
//       }
//       if(!outOfBoard(position.row - 2, position.square + 2) && turn === "red" && boardState[position.row - 1][position.square + 1].pieceColor === "black" && !boardState[position.row - 2][position.square + 2].piece) {
//           newPositions.push({row: position.row - 2, square: position.square + 2});
//           moves.push({row: position.row - 2, square: position.square + 2});
//           removedPieces.push({row: position.row - 1, square: position.square + 1, });
//           jumpFurther = true;
//       }
//       if(jumpFurther) {
//           moves = moves.filter(location => {
//               return location.row !== position.row && location.square !== position.square;
//           });
//           jumpFurther = false;
//       }
//   });
  
//   return checkJumps(newPositions, moves, removedPieces, boardState, turn);
// }

// function outOfBoard(row, square) {
//   if(row > 7 || row < 0 || square < 0 || square > 7) {
//       return true;
//   } 
//   return false;
// }

// function availableMoves(row, square, boardState, turn) {
//   var movesObject = {
//       moves: [],
//       removedPieces: []
//   };
  
//   if(boardState[row][square].pieceColor === "red" && turn === "red"){
//        if(!outOfBoard(row - 1, square - 1) && !boardState[row - 1][square - 1].piece) {
//           movesObject.moves.push({row: row - 1, square: square - 1});
//        }
//        if(!outOfBoard(row - 1, square + 1) && !boardState[row - 1][square + 1].piece){
//           movesObject.moves.push({row: row - 1, square: square + 1});
//        }
//   } else if(boardState[row][square].pieceColor === "black" && turn === "black") {
//       if(!outOfBoard(row + 1, square + 1) && !boardState[row + 1][square + 1].piece) {
//           movesObject.moves.push({row: row + 1, square: square + 1});
//        }
//        if(!outOfBoard(row + 1, square - 1) && !boardState[row + 1][square - 1].piece){
//           movesObject.moves.push({row: row + 1, square: square - 1});
//        }
//   }
//   movesObject = checkJumps([{row: row, square: square}], movesObject.moves, [], boardState, turn);
//   console.dir(movesObject);
//   return movesObject;
// }

function gameOver(boardState) {
    var gameOver = true;
    boardState.forEach((row, rowIndex) => {
      row.forEach((square, squareIndex) => {
          if(!availableMoves(rowIndex, squareIndex).moves.length) {
            gameOver = false;
          }
      });
    });
    return gameOver;
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
  db.create_match(player_id, roomID, turn_time, (result) => {
      if(result) {
        callback(true, roomID);
      }
      else {
        callback(false, roomID);
      }
  });
}

io.on('connection', function (socket) {
  socket.on('createGame', function(data) {
    socket.player_id = data.id;
    console.log("create game!");
    createGame(data.id, generateRoomName(), data.turn_time, (gameCreated, roomID) => {
        if(gameCreated) {
          db.getAllGames((result) => {
            socket.join(roomID);
            io.of('/').emit('updateGameList', result);
          });
        }
    });
  });
  socket.on('joinGame', function(data) {
    db.joinMatch(data.user_id, data.match_id, (joinedGame, match_id) => {
      if(joinedGame) {
        console.log("joined game + match ID: " + match_id);
        socket.join(match_id);
        io.to(match_id).emit('startGame', match_id);
      }
    });
  });
  // socket.on('search', function (data) {
  //     socket.duration = data.duration;
  //     players.push(socket);
  //     opponent = findOpponent(socket);
  //     console.log("Protivnik je " + socket.opponent);
  //     if(opponent) {
  //       roomID = generateRoomName();
  //       game.id = roomID;
  //       game.playerOne = socket;
  //       game.playerTwo = opponent;
  //       opponent.join(roomID);
  //       socket.join(roomID);
  //       io.to(roomID).emit('foundGame', {game: roomID});
  //     }
  // });

  socket.on('move', function(data){
    console.log("move!");
    console.log();
    if(true) {
        console.log("njegov turn!");
    } else {
        console.log("nije njegov turn!");
    }
    io.to(roomID).emit('updateBoardState', data);
  });

  function playersTurn(game, socket) {
    if((socket.id === game.playerOne.socket.id && game.turn === game.playerOneColor) || socket.id === game.playerTwo.socket.id && game.turn === game.playerTwoColor) {
        return true;
    }
    return false;
}
  socket.on('changeTurn', function(data) {
    socket.game.turn = data.turn;
  });

  socket.on('updateBoardState', function(data){
    socket.boardState = data.boardState;
  });

  socket.on('deleteLobby', function() {
    if(socket.player_id) {
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
    if(socket.player_id) {
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

