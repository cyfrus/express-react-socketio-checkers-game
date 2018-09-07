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


var players = [],
    roomID,
    games = [];

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

io.on('connection', function (socket) {
    var game = {
        id: '',
        turn: "red",
        playerOne: socket,
        playerTwo: undefined,
        playerOneColor: "red",
        playerTwoColor: "black",
        status: "not started" 
    }, opponent;

  socket.on('newGame', function (data) {
    console.log("New game!");
    game.status = "in progress";
  });

  socket.on('search', function (data) {
      socket.duration = data.duration;
      players.push(socket);
      opponent = findOpponent(socket);
      console.log("Protivnik je " + socket.opponent);
      if(opponent) {
        roomID = generateRoomName();
        game.id = roomID;
        game.playerOne = socket;
        game.playerTwo = opponent;
        opponent.join(roomID);
        socket.join(roomID);
        io.to(roomID).emit('foundGame', {game: roomID});
      }
  });

  socket.on('setTheGame', function(data){
    console.log("set The game data !");
    console.log(data);
  });

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
  socket.on('stopSearch', function (data) {
      removePlayer(socket.id)
  });

  socket.on('accepted', function (){
      removePlayer(socket.id);
      //test test
  });

  socket.on('updateBoardState', function(data){
    socket.boardState = data.boardState;
  });

  socket.on('disconnect', function () {
    removePlayer(socket.id);
    console.log("client disconnected!");
  });

  socket.on('declined', function () {
    removePlayer(socket.id);
  });

  socket.on('addTurn', function(data) {
    socket.turn = data.turn;
  });
  console.log("client connected!");
});


function removePlayer(id) {
  players.pop(players.find(function(element){
    return element.id === id;
  }));
}

function findOpponent(player) {
   return players.find(function(element){
      return player.id !== element.id && player.duration === element.duration;
   });
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

