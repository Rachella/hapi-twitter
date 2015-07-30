

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/tweets',
      handler: function(request, reply){
        //access the mongodb
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('tweets').find().toArray(function(err, tweets){
          if (err) { return reply('Internal MongoDB error', err); }

          reply(tweets);
        })
      }
    }
  ]);
  next();
}

exports.register.attributes = {
  name: 'tweets-routes',
  version: '0.0.1'
};