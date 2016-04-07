/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var express = require("express"),
  multer = require("multer"),
  request = require("request"),
  path = require("path"),
  emailer = require("nodemailer"),
  app = express();
var options = multer.diskStorage({ destination : "./upload" ,
  filename: function (req, file, cb) {
    "use strict";
    //
    cb(null, (Math.random().toString(36)+"00000000000000000").slice(2, 10) + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: options });
// set up a static file directory to use for default routing
// also see the note below about Windows
app.use(express.static(__dirname));
// Create our Express-powered HTTP server
app.listen(8000, function () {
  "use strict";
  console.log("Blackmail app listening on port 8000!");
});

app.post("/upload", upload.single("image"), function(req,res){
  "use strict";
  var fileData = path.parse(req.file.path);
  console.log(req.file);
  console.log(req.body); // form fields
  //posts to JSON Server
  request.post("http://localhost:3000/blackmails").form({
    "creator": req.body.creator,
    "title": req.body.title,
    "recName": req.body.recName,
    "recEmail": req.body.recEmail,
    "date": req.body.date,
    "time": req.body.time,
    "demands": req.body.demands,
    "demandsMet": false,
    "url": fileData.name,
    "randomCode": req.body.randomCode
  });


  var date = req.body.date;
  var demands = req.body.demands;
  var randomCode = req.body.randomCode;
  var recEmail = req.body.recEmail;
  var recName = req.body.recName;
  var time = req.body.time;
  var title = req.body.title;

  //for SMTP feature
  var emailTransporter = emailer.createTransport("smtps://blackmailappcpsc473%40gmail.com:cpsc12345!@smtp.gmail.com");
  var mailOptions = {
    from: '"Blackmailapp Admin" <blackmailappcpsc473@gmail.com>',
    to: recEmail,
    subject: "You Got Blackmailed!",
    html: "<h1>"+ title + "</h1>" + "<h3>From: " + recName + "<br>" + "<h3>Release Date: " + date + " " + time + "<h3>Demands: " + demands + "<h3>Please visit http://localhost:8000 and enter the code: " + randomCode
  };
  
  emailTransporter.sendMail(mailOptions, function(error, info){
     if(error){
         return console.log(error);
     } 
     console.log("Message Sent!");
  });
  res.status(200).end();
});
