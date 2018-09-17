var express = require('express');
var db = require('../db/connection');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next){
  res.json({ test: "test"});
});

router.post('/register', function(req, res, next){
  db.insert_user(req.body.username, req.body.email, req.body.password, req.body.about, (result) => {
    res.json(result)
  });
}); 

router.get('/getGames', function(req, res, next) {
  db.getAllGames(result => {
    res.json(result);
  });
});
router.post('/getMatchData', function(req, res, next){
    db.getGame(parseInt(req.body.match_id), result => {
      let game = {
        PLAYER1: result[0].username,
        PLAYER2: result[1].username,
        PLAYER1ID: result[0].player_id,
        PLAYER2ID: result[1].player_id,
        TURN: result[0].turn,
        RED: result[0].red,
        BLACK: result[0].black,
        ROOM_ID: result[0].roomID,
        MOVES: transformTextToMoves(result[0].moves),
        MATCH_ID: result[0].game_ID
      };
      res.json(game);
    });
});

router.post('/checkMove', function (req, res, next) {  
  db.getGame(req.body.user_id, result => {
      res.json(result);
  });
});

router.post('/authenticate', function(req, res, next){
  var auth = {
    success: false,
    user: {}
  };
  if(req.body.username && req.body.password) {
    db.authenticate(req.body.username, req.body.password, function(result) {
      if(result) {
        auth.success = true;
        auth.user = result;
      }
        res.json(auth);
     });
  } else {
    res.json(auth);
  }
});

router.get('/getNumOfPlayers', function(req, res, next){
  db.getPlayers(function(result){
    res.json({
      numberOfPlayers: result
    });
  });
});

function checkMove(user_id, move, matchData) {
   console.log("check move!");
   console.log(matchData);
   return false;
}

var transformTextToMoves = function(moves) {
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
          delSquare = move.slice(6, 7);
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

var transformMoveToText = function(from, to, color) {
  let move = "",
      colorPrefix = color === "red" ? "R" : "B";
   move = colorPrefix + "F" + from.row.toString() + from.square.toString() + "T" + to.row.toString() + to.square.toString();
   console.log(move);
   return move;
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

module.exports = router;
