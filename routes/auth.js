module.exports = {}; 

module.exports.authenticated = function(request, callback){
  var cookie = request.session.get('hapi_twitter_session');

  if (!cookie) {
    return callback({ authenticated: false, message: 'error' });
  }
  var session_id = cookie.session_id;
  var db = request.server.plugins['hapi-mongodb'].db;

  db.collection('sessions').findOne({ session_id: session_id }, function(err, session){
    if (!session) {
      return callback({ authenticated: false, message: msg });
    }
    callback({ authenticated: true, user_id: session.user_id });
  });
};
