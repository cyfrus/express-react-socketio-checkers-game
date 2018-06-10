var express = require('express');
var db = require('../db/connection');
var bcrypt = require('bcrypt');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.io.on('connection', function (socket) {
  //   socket.emit('news', { hello: 'world' });
  //   socket.on('my other event', function (data) {
  //     console.log(data);
  //   });
  // });
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next){
  res.json({ test: "test"});
});

router.post('/insert', function(req, res, next){
  console.log("insert zahtjev!!");
  console.log(req.body.username);
  db.insert_user(req.body.username, req.body.email, req.body.password);
}); 

router.post('/authenticate', function(req, res, next){
  console.log(req.body.username);
  console.log(req.body.password);
    if(req.body.username && req.body.password) {
      db.authenticate(req.body.username, req.body.password, function(result) {
        bcrypt.compare(req.body.password, result.password, function(err, authed) {
          var auth = {auth: false};
              if(authed) {
                auth.auth = true;
                res.json(auth);
              } else {
                res.json(auth);
              }
          });
       });
    } else {
      res.json({ autentication: "failed"});
    }
});

module.exports = router;
