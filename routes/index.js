var express = require('express');
var db = require('../db/connection');
var bcrypt = require('bcrypt');
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
  console.log("insert zahtjev!!");
  console.log(req.body.username);
  db.insert_user(req.body.username, req.body.email, req.body.password, req.body.about, (result) => {
    res.json(result)
  });
}); 

router.post('/authenticate', function(req, res, next){
  var auth = {
    auth: false,
    user: {}
  };
  if(req.body.username && req.body.password) {
    db.authenticate(req.body.username, req.body.password, function(result) {
      if(result) {
        bcrypt.compare(req.body.password, result.password, function(err, authed) {
            auth.auth = authed;
            auth.user = result
            res.json(auth);
          });
      } else {
          res.json(auth);
      }
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

module.exports = router;
