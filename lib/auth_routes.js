'use strict';

var User = require('./models/models.js').User;

module.exports = function(router, passport) {
  //router.use(bodyparser.json());
  //(we're already using this in router.js)

  router.post('/create_user', function(req, res) {
    var newUserData = JSON.parse(JSON.stringify(req.body)); //stringifying and parsing to make a deep copy
    //Making sure that our user's password is only ever stored as a hash,
    //and that it and email are kept within the basic sub-object
    delete newUserData.email;
    delete newUserData.password;
    var newUser = new User(newUserData);
    newUser.basic.email = req.body.email;
    newUser.basic.password = newUser.generateHash(req.body.password);
    newUser.save(function(err, user) {
      if (err) {
        //console.log(err);
        return res.status(500).json({msg: 'could not create user'});
      }

      user.generateToken(process.env.APP_SECRET, function(err, token) {
        if (err) {
          //console.log(err);
          return res.status(500).json({msg: 'error generating token'});
        }

        res.json({token: token});
      });
    });
  });

  router.get('/sign_in', passport.authenticate('basic', {session: false}),
  function(req, res) {
    console.log('SLDKJFLSKDJFLSK');
    req.user.generateToken(process.env.APP_SECRET, function(err, token) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error generating token'});
      }

      res.json({token: token});
    });
  });
};
