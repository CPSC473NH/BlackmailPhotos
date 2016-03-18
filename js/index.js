//GLYPHICONS Halflings font is also released as an extension of a Bootstrap www.getbootstrap.com for free and it is released under the same license as Bootstrap. 
//Thank you to GLYPHICONS.com for GLYPHICONS Halflings
$(document).ready(function() {
  "use strict";

  var $signup = document.getElementById("signup");
  var $signin =  document.getElementById("signin");
  var $createBlackmail =  document.getElementById("createBlackmail");
  var $viewBlackmail = document.getElementById("viewBlackmail");
  var $logOut = document.getElementById("logOut");
  var $greeting = document.getElementById("greeting");
  var $errorMsg = document.getElementById("errorMsg");
  var $currentUser = ""; 

  // initialize input widgets first
  $("#createModal .time").timepicker({
      'timeFormat': 'h:i a',
      'disableTextInput': true,
  });

  $("#createModal .date").datepicker({
      'format': "mm/dd/yyyy",
      'autoclose': true,
      'todayHighlight': true,
      'todayBtn': "linked",
      'startDate': "today",
  });

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
        $("#errorMsg").text("Sign up failed. Account exists, please try again!");
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

  $("#createBlackmail").click(function() {
    $("#createModal").modal();
  });

  $("#create").click(function() {
    var createData = _.object($("#create-form").serializeArray().map(function(v) {return [v.name, v.value];} ));
  
    $.post("http://localhost:3000/blackmails", {
          "creator": $currentUser,
          "title": createData.title,
          "recName": createData.recName,
          "recEmail": createData.recEmail,
          "date": createData.date,
          "time": createData.time,
          "demands": createData.demands,
          "demandsMet": false,
        }, function() {
          $("#createModal").modal("hide");
    });
  });

  $("#viewBlackmail").click(function() {
      $.get("http://localhost:3000/blackmails", {"creator": $currentUser}, function(data) {
        $("#mainHeader").empty().append('<span class="glyphicon glyphicon-envelope " aria-hidden="true"></span> Your Blackmails');
        $("#blackmailDisp").empty();
        $("#viewList").empty();
        for(var i = 0; i < data.length; i++)
        {
          var deadline = 'December 31 2016';
          var $singleMail = '<div class="col-lg-3 col-md-4 col-xs-6 thumb">';
          $singleMail += '<a class="thumbnail" href="#">';
          $singleMail += '<img class="img-responsive" src="http://placehold.it/400x300" alt="'+data[i].title+'"></a>';
          $singleMail += '<ul class="list-group">';
          $singleMail += '<li class="list-group-item"><b>Title</b>: '+data[i].title;
          $singleMail += '<li class="list-group-item"><b>Recipient Name</b>: '+data[i].recName;
          $singleMail += '<li class="list-group-item"><b>Recipient Email</b>: '+data[i].recEmail;
          $singleMail += '<li class="list-group-item"><b>Demands</b>: '+data[i].demands;
          var $icon = '<span class="glyphicon glyphicon-remove " style="color:red" aria-hidden="true"></span>';
          if(data[i].demandsMet){
            $icon = '<span class="glyphicon glyphicon-ok green" style="color:green" aria-hidden="true"></span>';
          }
          $singleMail += '<li class="list-group-item"><b>Demands Met? </b>: '+$icon;
          $singleMail += '<li class="list-group-item"><b>Release Date</b>: '+data[i].date;
          $singleMail += '<li class="list-group-item"><b>Release Time</b>: '+data[i].time;
          $("#blackmailDisp").append($singleMail);
        }
      });
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

          var $greeting = '<span class="text-primary" id="greeting">Hello, ' + data[0].username + '!</li>';
          $currentUser = data[0].username;
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
    makeGallery();
  });

  $("#brand").click(function() {
    makeGallery();
  });

  $("#home").click(function() {
    makeGallery();
  });

  function makeGallery(){
    $("#mainHeader").empty().append('<span class="glyphicon glyphicon-envelope " aria-hidden="true"></span> The Blackmail Gallery');
    $("#blackmailDisp").empty();
    var $singleMail ='<div class="col-lg-3 col-md-4 col-xs-6 thumb">'
    $singleMail += '<a class="thumbnail" href="#">';
    $singleMail += '<img class="img-responsive" src="http://placehold.it/400x300" alt="">';
    for(var i = 0; i < 12; i++)
    {
        $("#blackmailDisp").append($singleMail);
    }
  }
});