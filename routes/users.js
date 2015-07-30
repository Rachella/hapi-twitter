var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server, options, next){
  server.route([
      {
        method: 'POST',
        path: '/users',
      config: {
          handler: function(request, reply){
            var db = request.server.plugins['hapi-mongodb'].db;
            var user = request.payload.user;
            var unqiUserQuery = {
              $or: [
                {username: user.username},
                {email: user.email}
              ]
            };

            Bcrypt.genSalt(10, function(err, salt){
              Bcrypt.hash(user.password, salt,function(err, encrypted){
                user.password = encrypted;
                db.collection('users').count(unqiUserQuery, function(err, userExist){
                  if (userExist) {
                    return reply("Error. Username already exists");
                  }

                  db.collection('users').insert(user, function(err, writeResult){
                    if (err) {return reply("Internal MongoDB error", err)}

                    reply(writeResult);
                  })
                });

                
              })
            })
          },
          validate: {
            payload: {
              user: {
                email: Joi.string().email().max(50).required(),
                password: Joi.string().min(5).max(20).required(),
                username: Joi.string().min(2).max(20).required(),
                name: Joi.string().min(2).max(20)
              }
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/users',
        handler: function(request,reply){
          Auth.authenticated(request, function(session){
            if(!session.authenticated) {
              return reply(session);
            }
            var db = request.server.plugins['hapi-mongodb'].db;

            db.collection('users').find().toArray(function(err, users){
            if (err) { return reply("Internal MongoDB error", err); }

            reply(users);
          });
        });
      }
    }  
  ]);

  next(); 
};

exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};