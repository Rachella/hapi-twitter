//Hapi is class
var Hapi = require('hapi');

//instantiation
var server = new Hapi.Server();

//Configure server connection
server.connection({
  host: '0.0.0.0',
  port: 3000,
  routes: {
    cors: {
      headers: ['Access-Control-Allow-Credentials'],
      credentials: true
    }
  }
});

//Any other dependencies
var plugins = [
//require MongoDB
  {
    register: require('hapi-mongodb'),
    options: {
      url: "mongodb://127.0.0.1:27017/hapi-twitter",
      settings: {
        db: {
          native_parser: false
        }
      }
    } 
  }
];

//Start server
server.register(plugins, function(err) {
  // check error
  if (err) {
    throw err;
  }

//Start server
  server.start(function(err) {
    console.log('info', 'Server running at: ' + server.info.uri);
  });
});