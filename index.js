

$(document).ready(function() {
  "use strict";

  var $signup = document.getElementById("signup");
  var $signin =  document.getElementById("signin");
  var $createBlackmail =  document.getElementById("createBlackmail");
  var $viewBlackmail = document.getElementById("viewBlackmail");
  var $logOut = document.getElementById("logOut");
  var $greeting = document.getElementById("greeting");
  var $errorMsg = document.getElementById("errorMsg"); 

  $("#signup").click(function() {
    $("#signinButton").hide();
    $("#registerButton").show();
    $("#registerSignin-title").empty().append("Sign up");
    $("#registerSignIn").modal();
  });

  $("#registerButton").click(function() {
    var registrationData = _.object($("#registerSignIn-form").serializeArray().map(function(v) {return [v.name, v.value];} ));  //returns form values as key value pairs
    
    $.get("http://localhost:3000/accounts", {"username": registrationData.email,"password": registrationData.password}, function(data) {

      if (data.length <= 0) { // if account doesn't exist
        $.post("http://localhost:3000/accounts", {
          "username": registrationData.email,
          "password": registrationData.password
        }, function() {
          //put an alert in here for now
          alert("successfully posted!");
        });
      }
      else {
        $("#errorMsg").text("Sign up failed. Account exist, please try again!");
        $errorMsg.style.display = "block";
      }

    });
  });

  $("#signin").click(function() {
    $("#registerButton").hide();
    $("#signinButton").show();
    $("#registerSignin-title").empty().append("Sign in");
    $("#registerSignIn").modal();
  });

  $("#signinButton").click(function() {
    var signinData = _.object($("#registerSignIn-form").serializeArray().map(function(v) {return [v.name, v.value];} ));//converts form data to associative array
      //TODO: post for signing in
      $.get("http://localhost:3000/accounts", {"username": signinData.email,"password": signinData.password}, function(data) {

        if (data.length <= 0) { // if account doesn't exist
          $("#errorMsg").text("Account does not exist. Please try again!");
          $errorMsg.style.display = "block"; //show error message
        }
        else { // if account exist
          $("#registerSignIn").modal("hide");
          $signup.style.display = "none";
          $signin.style.display = "none";
          $createBlackmail.style.display = "list-item";
          $viewBlackmail.style.display = "list-item";
          $logOut.style.display = "list-item";

          var $greeting = '<span class="bg-primary" id="greeting">Hello, ' + data[0].username + '!</li>';
          $("#navbar").append($greeting);
        }

      });
  });

  $("#logOut").click(function() {
    $signup.style.display = "list-item";
    $signin.style.display = "list-item";
    $createBlackmail.style.display = "none";
    $viewBlackmail.style.display = "none";
    $logOut.style.display = "none";
    $("#greeting").remove();
  });
});