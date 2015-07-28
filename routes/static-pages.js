exports.register = function(server, option, next){
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function(request, reply){
        reply.view("index"); //going to look for templates/index.html
        }
      }, 
      {
        method: 'GET',
        path: '/public/{path*}',
        // /public/application.js
        // /public/custom.css
        handler: {
          directory: {
            path: 'public'
          }
        }
      }  
  ])
  next();
}

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};