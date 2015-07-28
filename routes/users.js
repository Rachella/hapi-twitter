//Defining the plugin
exports.register = function(server, options, next){
  //Define routes
  //handles the request
  server.route([
    // I am **receiving** a POST request
      {
        method: 'POST',
        path: '/users',
        handler: function(request, reply){
          var db = request.server.plugins['hapi-mongodb'].db;

          var user = request.payload.user;
          // user = {
          //    name: ...,
          //    email: ...
          //}
          
          db.collection('users').insert(user, function(err, writeResult){
            reply(writeResult);
            //with the function because waits for collection to be successful before replying.
          });
        }
      }
    ]);

  next(); //<= don't forget this
};

//Defining the decription of the plugin
exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};