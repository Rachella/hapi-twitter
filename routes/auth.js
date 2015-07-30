module.exports = {}; //equivalent of saying that var Auth = {};

//define the functions here, calling them in sessions.js, parameter names do not have to match sessions.js (i.e. callbackFunction could be named callback)
module.exports.authenticated = function(request, callback){
  //do all the logic

  // test - return true to see if it works
  // var result = { authenticated: true };
  // callback(result);

  //return true if user is logged in
  //return false if not

  //1. retrieve session_id from cookie
  var cookie = request.session.get('hapi_twitter_session');

  if (!cookie) {
    return callback({ authenticated: false, message: 'error' });
  }

  var session_id = cookie.session_id;
  // callback( { session_id: session_id });


  //2. look into DB to find matching session_id, because want to have option of getting user id.
  var db = request.server.plugins['hapi-mongodb'].db;

  db.collection('sessions').findOne({ session_id: session_id }, function(err, session){
    //3 return true / false
    if (!session) {
      return callback({ authenticated: false, message: msg });
    }

    callback({ authenticated: true, user_id: session.user_id });
  });
};
