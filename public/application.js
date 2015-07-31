$(document).ready(function (){

  // var username = $('#username');
  // var password = $('#password');  

  var name = $('#name');
  var email = $('#email');  
  var username2 = $('#username2');
  var password2 = $('#password2');  

  function addTweet(entry) {
    $('.tweetlist').prepend('<li>' + entry.message + '</li>');
  }

  $('#sign-in').click(function() {
    event.preventDefault();
    var username = $('input[id="username"]');
    var password = $('input[id="password"]');
    $.ajax({
      type: 'POST',
      //indent?
      url: 'sessions',
      data: {
        user: {      
          username: username.val(),
          password: password.val()
        }
      },  
      dataType: 'json',
      success: function(response) {
      if (response.userExists) { 
        console.log("Success", response);
        } else {
          console.log("No such user or wrong password")
        }
      }
    });
  });    

  $('#sign-up').click(function() {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/users',
      data: {
        user: {      
          name: name.val(),
          email: email.val(),
          username: username2.val(),
          password: password2.val()
        }
      },
      dataType: 'json',
      success: function(response) {
        console.log("Success", response);      
      }
    });
  });

  //Write a tweet
  $('#update').click(function(){
    event.preventDefault();
    var update = $('input[id="tweet-here"]');
    console.log(update.val())
    $.ajax({
      type: 'POST',
      url: '/tweets',
      data: {
        tweet: {message: update.val()}
      },
      dataType: 'json',
      success: function(newTweet) {
        addTweet(newTweet);
        console.log('Success', newTweet);
      },
      error: function() {
        console.log('Error adding post');
      }
    });
  });


  //List all tweets
  var getData = function(){
    $.ajax({
      type: 'GET',
      url: '/tweets',
      dataType: 'json',
      success: function(entries){
        $.each(entries, function(i, entry) {
        addTweet(entry);
        });
        console.log('Success', entries)
      },
      error: function() {
        console.log('Error getting posts');
      }
    });
  };
  getData();
})    


