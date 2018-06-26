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

var players = [];



io.on('connection', function (socket) {
  socket.on('search', function (data) {
      var player = {
        socket: socket,
        duration: data.duration,
        opponent: data.opponent
      };
      players.push(player);
      var opponent = findOpponent(player);
      console.log("Protivnik je " + opponent);
      if(opponent) {
        var room = generateRoomName();
        opponent.socket.join(room);
        socket.join(room);
        io.to(room).emit('foundGame', {game: room});
      }
  });
  socket.on('stopSearch', function (data) {
      removePlayer(socket.id)
      console.log(players); 
  });

  socket.on('accepted', function (){
      removePlayer(socket.id);
      console.log(players);
  });

  socket.on('declined', function () {
    removePlayer(socket.id);
    console.log(players);
  });
  console.log("client connected!");
});


function removePlayer(id) {
  players.pop(players.find(function(element){
    return element.socket.id === id;
  }));
}

function findOpponent(player) {
   return players.find(function(element){
      return player.socket.id !== element.socket.id && player.duration === element.duration;
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

