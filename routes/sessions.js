var Bcrypt = require('bcrypt');
var Auth = require('./auth'); //var Auth = {};
//to do Auth.authenticated() - do the same in auth.js
exports.register = function(server, options, next){

  server.route([
    {
      method: 'POST',
      path: '/sessions',
      handler: function(request,reply){
        var db = request.server.plugins['hapi-mongodb'].db;

        var user = request.payload.user;

        db.collection('users').findOne({ username: user.username }, function(err, userMongo){
          if (err) { return reply('Internal MongoDB error', err); }
          //1. stop if user doesn't work
          if (userMongo === null){
            return reply({ userExists: false });
          }

          //2check password, can use userMongo.password to get encrypted password because we used db collection findOne
          Bcrypt.compare(user.password, userMongo.password, function(err, same){
            if(!same) {
              return reply({ authorized: false });  
            }

            var randomKeyGenerator = function() {
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            //create a new session
            var session = {
              user_id: userMongo._id,
              session_id: randomKeyGenerator()
            };

            db.collection('sessions').insert(session, function(err, writeResult){
              if (err) {return reply('Internal MongoDB error', err); }

              //4 set same session_id in the CLIENT's cookie
              request.session.set('hapi_twitter_session', session);

              reply({ userExists: true });
            }); 
          })
        });

      }      
    },
    {
      //defining a route to check if the user is authenticated / logged in
      method: 'GET',
      path: '/authenticated',
      handler: function(request, reply){
        //normally logic is written here
        //but we will write it somewhere else so other files or routes can also use this method
        var callback = function(result){
          reply(result);
        };
        Auth.authenticated(request, callback);
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
}