var Bcrypt = require('bcrypt');
var Joi = require('joi');

//Defining the plugin
exports.register = function(server, options, next){
  //Define routes
  //handles the request
  server.route([
    // I am **receiving** a POST request
      {
        method: 'POST',
        path: '/users',
      config: {
          handler: function(request, reply){
            var db = request.server.plugins['hapi-mongodb'].db;
            var user = request.payload.user;
            // user = {
            //    name: ...,
            //    email: ...
            //}
            
            // db.collection('users').insert(user, function(err, writeResult){
            //   reply(writeResult);
            //   //with the function because waits for collection to be successful before replying.
            // });
            //or operator is if there is multiple fields
            var unqiUserQuery = {
              $or: [
                {username: user.username},
                {email: user.email}
              ]
            };

            //encrypt the password
            Bcrypt.genSalt(10, function(err, salt){
              Bcrypt.hash(user.password, salt,function(err, encrypted){
                user.password = encrypted;
                //inserting a user doc into the DB
                //if unqiuserquery is true then userExist will return. First parameter is always an error. use return in if statement so no need for else.
                db.collection('users').count(unqiUserQuery, function(err, userExist){
                  //see if it request reply(result aka userExist)
                  // reply(userExist);
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
    // All users
      {
        method: 'GET',
        path: '/users',
        handler: function(request,reply){
          var db = request.server.plugins['hapi-mongodb'].db;
          db.collection('users').find().toArray(function(err, users){
            if (err) { return reply("Internal MongoDB error", err); }

            reply(users);
          });
        }
      }
  ]);

  next(); //<= DO NOT FORGET THIS!
};

//Defining the decription of the plugin
exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};