/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
//GLYPHICONS Halflings font is also released as an extension of a Bootstrap www.getbootstrap.com for free and it is released under the same license as Bootstrap.
//Thank you to GLYPHICONS.com for GLYPHICONS Halflings
///www.pexels.com/search/people/ All these free images of people can be used according to the Creative Commons Zero (CC0) 
var $currentUser = ""; 

$(document).ready(function() {
  "use strict";

  var $signup = document.getElementById("signup");
  var $signin =  document.getElementById("signin");
  var $createBlackmail =  document.getElementById("createBlackmail");
  var $viewBlackmail = document.getElementById("viewBlackmail");
  var $logOut = document.getElementById("logOut");
  var $greeting = document.getElementById("greeting");
  var $errorMsg = document.getElementById("errorMsg");

  var initialLoad = false;
  if(!initialLoad){
    makeGallery();
    initialLoad = true;
  }

  // initialize input widgets first
  $("#createModal .time").timepicker({
      "timeFormat": "h:i a",
      "disableTextInput": true
  });

  $("#createModal .date").datepicker({
      "format": "mm/dd/yyyy",
      "autoclose": true,
      "todayHighlight": true,
      "todayBtn": "linked",
      "startDate": "today"
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
          $("#registerSignIn").modal("hide");
          $("#inputEmail").val("");
          $("#inputPassword").val("");
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
    $("#randomCode").val(randomString(32, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"));
    $("#creator").val($currentUser);
    $("#createModal").modal();
  });


  $("#create-form").submit(function() {
    //disable the default form submission
    event.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      url: "/upload",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        $("#createModal").modal("hide");
        $("#title").val("");
        $("#recName").val("");
        $("#recEmail").val("");
        $("#date").val("");
        $("#time").val("");
        $("#demands").val("");
        $("#imageUpload").val("");
        makeMyBlackmails();
        return false;
      }
    });
  });

  $("#viewBlackmail").click(function() {
    makeMyBlackmails();
  });

  $("#signinButton").click(function() {
    var signinData = _.object($("#registerSignIn-form").serializeArray().map(function(v) {return [v.name, v.value];} ));//converts form data to associative array
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
          makeMyBlackmails();
        }

      });
  });

  $("#viewCodeBlackmail").click(function() {
    $.get("http://localhost:3000/blackmails", {"randomCode": $("#mycode").val()}, function(data) {
        if(data.length > 0){
          showSingleBlackmail(data[0].id);
        }
        else{
          alert("Something happened please try again!");
        }
    });
  });

  $("#upload").click(function() {
    var fileInput = document.getElementById("image");
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append("file", file);

    console.log(file);
    $.ajax({
      type: "POST",
      url: "/upload",
      processData: false,
      contentType: false,
      data: {"image" : file},
      success: function (response, textStatus, jqXHR){
        console.log(response);
      }
    });
  });

  $("#logOut").click(function() {
    $currentUser = "";
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

  $("#about").click(function() {
    showAbout();
  });

  function showAbout(){
    $("#mainHeader").empty().append('<span class="glyphicon glyphicon-glass" aria-hidden="true"></span> About');
    $("#blackmailDisp").empty();
    var $aboutContents ='<div>Hello!<br><br>BlackmailPhotos offers a great and easy way to extort your friends, family, coworkers, employers, and even yourself!</div>';

    $("#blackmailDisp").append($aboutContents);
  }

  $("#contact").click(function() {
    showContact();
  });

  function showContact(){
    $("#mainHeader").empty().append('<span class="glyphicon glyphicon-phone-alt" aria-hidden="true"></span> Contact');
    $("#blackmailDisp").empty();
    var $contactInfo ="<div>Please address all complaints and legal threats to:<br><br>";
    $contactInfo += "Former Vice President Dick Cheney<br>";
    $contactInfo += "The American Enterprise Institute<br>";
    $contactInfo += "1150 Seventeenth Street, N.W.<br>";
    $contactInfo += "Washington, DC 20036</div>";

    $("#blackmailDisp").append($contactInfo);
  }

  function makeGallery(){
      $.get("http://localhost:3000/blackmails", function(data) {
      $("#mainHeader").empty().append('<span class="glyphicon glyphicon-envelope " aria-hidden="true"></span> Released Blackmail Photos');
      $("#blackmailDisp").empty();
      if (data.length > 0){
        for(var i = 0; i < data.length; i++)
        {
          var $deadline = data[i].date;
          var $timeCon = data[i].time;
          $deadline += ' ';

          if ($timeCon.indexOf("pm") !== -1){
            if($timeCon.indexOf("12") !== -1)
            {
              $deadline += $timeCon.substring(0, 5)+':00';
            }else{
              $deadline += (parseInt($timeCon.substring(0, 2))+12)+$timeCon.substring(2, 5)+':00';
            }

          }
          else{
            if($timeCon.indexOf("12") !== -1)
            {
              $deadline += '00'+$timeCon.substring(2, 5)+':00';
            }
            else{
              $deadline += $timeCon.substring(0, 5)+':00';
            }

          }

          if (getTimeRemaining($deadline).total <= 0 && data[i].demandsMet === false){
            var $singleMail = '<div class="col-lg-3 col-md-4 col-xs-6 thumb">';
            $singleMail += '<a class="thumbnail" onclick="showGalleryBlackmail('+data[i].id+')" href="javascript:void(0)">';
            $singleMail += '<img class="img-responsive" style="max-width:50%;max-height:50%;" src="/upload/'+data[i].url+'.jpg" alt="'+data[i].title+'"></a>';
            $singleMail += '<ul class="list-group">';
            $singleMail += '<li class="list-group-item" id="'+data[i].id+'"><b>Title</b>: '+data[i].title;
            $singleMail += '<li class="list-group-item"><b>Person in the Photo</b>:<br>'+data[i].recName;
            $singleMail += '<li class="list-group-item"><b>Recipient Email</b>: '+data[i].recEmail;
            $singleMail += '<li class="list-group-item"><b>Release Date</b>: '+data[i].date;
            $singleMail += '<li class="list-group-item"><b>Release Time</b>: '+data[i].time;
            $("#blackmailDisp").append($singleMail);
          }
        }
      }
      else{
          $("#blackmailDisp").append('<h1 style="color:red">No Current Blackmails Found');
      }

    });
  }

}); //End of document.ready

function makeMyBlackmails(){
      $.get("http://localhost:3000/blackmails", {"creator": $currentUser}, function(data) {
      $("#mainHeader").empty().append('<span class="glyphicon glyphicon-envelope " aria-hidden="true"></span> Your Blackmails');
      $("#blackmailDisp").empty();
      if (data.length > 0){
        for(var i = 0; i < data.length; i++)
        {
          var $singleMail = "";
          $singleMail += '<div class="col-lg-3 col-md-4 col-xs-6 thumb">';
          $singleMail += '<a class="thumbnail" onclick="showSingleBlackmail('+data[i].id+')" href="javascript:void(0)">';
          $singleMail += '<img class="img-responsive" style="max-width:50%;max-height:50%;" src="/upload/'+data[i].url+'.jpg" alt="'+data[i].title+'"></a>';
          $singleMail += '<ul class="list-group">';
          $singleMail += '<li class="list-group-item" id="'+data[i].id+'"><b>Title</b>: '+data[i].title;
          $singleMail += '<li class="list-group-item"><b>Recipient Name</b>:<br>'+data[i].recName;
          $singleMail += '<li class="list-group-item"><b>Recipient Email</b>: '+data[i].recEmail;
          $singleMail += '<li class="list-group-item"><b>Demands</b>: '+data[i].demands;
          var $icon = '<span class="glyphicon glyphicon-remove " style="color:red;font-size: 25px;" aria-hidden="true"></span>';
          if(data[i].demandsMet){
            $icon = '<span class="glyphicon glyphicon-ok green" style="color:green;font-size: 25px;" aria-hidden="true"></span>';
          }
          $singleMail += '<li class="list-group-item"><b>Are The Demands Met? </b>: '+$icon;
          $singleMail += '<li class="list-group-item"><b>Release Date</b>: '+data[i].date;
          $singleMail += '<li class="list-group-item"><b>Release Time</b>: '+data[i].time;
          $singleMail += '<li class="list-group-item"><b>Delete Blackmail? </b>';
          $singleMail += '<button id="delete" type="button" onclick ="deleteBlackmail('+data[i].id+')" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-trash" style="color:blue" aria-hidden="true"></span>';
          $("#blackmailDisp").append($singleMail);
        }
      }
      else{
          $("#blackmailDisp").append('<h1 style="color:red">No Current Blackmails Found');
      }

    });
}

function showGalleryBlackmail($id) {
  $.get("http://localhost:3000/blackmails", {"id": $id}, function(data) {
    $("#mainHeader").empty().append('<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>' + data[0].title);
    $("#blackmailDisp").empty();
    var $singleBlackmailPage = '';
    $singleBlackmailPage += '<h1 class="col-md-12" style="color:red;font-size: 75px;">Photo Released</h1>';
    $singleBlackmailPage +='<div class="col-md-12"><img class="thumbnail img-responsive" src="/upload/'+data[0].url+'.jpg" alt=""></div>';
    $singleBlackmailPage += '<div class="col-md-6">';
    $singleBlackmailPage += '<ul class="list-group">';
    $singleBlackmailPage += '<li class="list-group-item"><b>Recipient Name</b>:<br>'+data[0].recName;
    $singleBlackmailPage += '<li class="list-group-item"><b>Recipient Email</b>: '+data[0].recEmail;
    $singleBlackmailPage += '<li class="list-group-item"><b>Release Date</b>: '+data[0].date;
    $singleBlackmailPage += '<li class="list-group-item"><b>Release Time</b>: '+data[0].time;
    $("#blackmailDisp").append($singleBlackmailPage);
  });
}

function showSingleBlackmail($id) {
  $.get("http://localhost:3000/blackmails", {"id": $id}, function(data) {
    $("#mainHeader").empty().append('<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>' + data[0].title);
    $("#blackmailDisp").empty();

    var $deadline = data[0].date;
    var $timeCon = data[0].time;
    $deadline += ' ';

    if ($timeCon.indexOf("pm") !== -1){
      if($timeCon.indexOf("12") !== -1)
      {
        $deadline += $timeCon.substring(0, 5)+':00';
      }else{
        $deadline += (parseInt($timeCon.substring(0, 2))+12)+$timeCon.substring(2, 5)+':00';
      }
    }
    else{
      if($timeCon.indexOf("12") !== -1)
      {
        $deadline += '00'+$timeCon.substring(2, 5)+':00';
      }
      else{
        $deadline += $timeCon.substring(0, 5)+':00';
      }

    }

    var $singleBlackmailPage = '';
    if (getTimeRemaining($deadline).total <= 0){
      $singleBlackmailPage += '<h1 class="col-md-12" style="color:red;font-size: 75px;">Photo Released</h1>';
    }
    else{
      $singleBlackmailPage += '<h1 class="col-md-12">Photo Releases in: </h1>';
      $singleBlackmailPage += '<div id="clockdiv" class="col-md-12">';
      $singleBlackmailPage += '<div>';
      $singleBlackmailPage += '<span class="days"></span>';
      $singleBlackmailPage += '<div class="smalltext">Days</div>';
      $singleBlackmailPage += '</div>';
      $singleBlackmailPage += '<div>';
      $singleBlackmailPage += '<span class="hours"></span>';
      $singleBlackmailPage += '<div class="smalltext">Hours</div>';
      $singleBlackmailPage += '</div>';
      $singleBlackmailPage += '<div>';
      $singleBlackmailPage += '<span class="minutes"></span>';
      $singleBlackmailPage += '<div class="smalltext">Minutes</div>';
      $singleBlackmailPage += '</div>';
      $singleBlackmailPage += '<div>';
      $singleBlackmailPage += '<span class="seconds"></span>';
      $singleBlackmailPage += '<div class="smalltext">Seconds</div>';
      $singleBlackmailPage += '</div></div>';
    }

    $singleBlackmailPage +='<div class="col-md-12"><img class="thumbnail img-responsive" src="/upload/'+data[0].url+'.jpg" alt=""></div>';

    $singleBlackmailPage += '<div class="col-md-6">';
    $singleBlackmailPage += '<ul class="list-group">';
    $singleBlackmailPage += '<li class="list-group-item"><b>Recipient Name</b>:<br>'+data[0].recName;
    $singleBlackmailPage += '<li class="list-group-item"><b>Recipient Email</b>: '+data[0].recEmail;
    $singleBlackmailPage += '<li class="list-group-item"><b>Demands</b>: '+data[0].demands;
    var $icon = '<span id="metSymbol" class="glyphicon glyphicon-remove " style="color:red;font-size: 50px;" aria-hidden="true"></span>';
    if(data[0].demandsMet){
      $icon = '<span id="metSymbol" class="glyphicon glyphicon-ok green" style="color:green;font-size: 50px;" aria-hidden="true"></span>';
    }
    $singleBlackmailPage += '<li class="list-group-item"><b>Are The Demands Met? </b>: '+$icon;

    if($currentUser !== ""){
          $singleBlackmailPage += '<li class="list-group-item"><b>Update Demand Status </b>: <div class="btn-group">';
          if(data[0].demandsMet){
            $singleBlackmailPage += '<button class="btn btn-danger" id="demandButton" onclick="updateDemandStatus('+data[0].id+')">Demands Not Met!</button>';
          }
          else{
            $singleBlackmailPage += '<button class="btn btn-success" id="demandButton" onclick="updateDemandStatus('+data[0].id+')">Demands Met!</button>';
          }

    }

    $singleBlackmailPage += '<li class="list-group-item"><b>Release Date</b>: '+data[0].date;
    $singleBlackmailPage += '<li class="list-group-item"><b>Release Time</b>: '+data[0].time;
    $singleBlackmailPage += '<li class="list-group-item"><b>Blackmail Code (Send To Victim)</b>: '+data[0].randomCode;
    if($currentUser !== ""){
      $singleBlackmailPage += '<li class="list-group-item"><b>Delete Blackmail? </b>';
      $singleBlackmailPage += '<button id="delete" type="button" onclick ="deleteBlackmail('+data[0].id+')" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-trash" style="color:blue" aria-hidden="true"></span>';
    }

    $("#blackmailDisp").append($singleBlackmailPage);
    if (getTimeRemaining($deadline).total >= 0){
      initializeClock("clockdiv", $deadline);
    }

  });
}

function deleteBlackmail($id) {
    $.ajax({
      "url" : "http://localhost:3000/blackmails/"+$id,
      "type" : "DELETE"
      }).done(function (response) {
          makeMyBlackmails();
      }).fail(function (err) {
          makeMyBlackmails();
    });
    makeMyBlackmails();
}

//example from http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function updateDemandStatus ($id) {
    if($("#metSymbol").css("color") == "rgb(0, 128, 0)"){
      $("#metSymbol").css("color", "red");
      $("#metSymbol").switchClass("glyphicon-ok green", "glyphicon-remove");
      $("#demandButton").switchClass("btn-danger","btn-success");
      $("#demandButton").text("Demands Met!");
    }
    else{
      $("#metSymbol").css("color", "green");
      $("#metSymbol").switchClass("glyphicon-remove", "glyphicon-ok green");
      $("#demandButton").switchClass("btn-success","btn-danger");
      $("#demandButton").text("Demands Not Met!");
    }   

    $.get("http://localhost:3000/blackmails", {"id": $id}, function(data) {
        $.ajax({
        "url" : "http://localhost:3000/blackmails/"+$id,
        "type" : "PUT",
        "data" : {
          "creator": data[0].creator,
          "title": data[0].title,
          "recName": data[0].recName,
          "recEmail": data[0].recEmail,
          "date": data[0].date,
          "time": data[0].time,
          "demands": data[0].demands,
          "demandsMet": !(data[0].demandsMet),
          "id": data[0].id,
          "url": data[0].url,
          "randomCode": data[0].randomCode
        }
       }).done(function (response) {
        
       }).fail(function (err) {

       });
    });
}