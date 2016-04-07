var express = require("express"),
  http = require("http"),
  multer = require("multer"),
  request = require("request"),
  path = require("path"),
  emailer = require("nodemailer"),
  app = express();
var options = multer.diskStorage({ destination : './upload' ,
  filename: function (req, file, cb) {
    cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: options });
// set up a static file directory to use for default routing
// also see the note below about Windows
app.use(express.static(__dirname));
// Create our Express-powered HTTP server
app.listen(8000, function () {
  console.log('Blackmail app listening on port 8000!');
});

app.post('/upload', upload.single('image'), function(req,res){
  var fileData = path.parse(req.file.path);
  console.log(req.file);
  console.log(req.body); // form fields
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

  
  var creator = req.body.creator;
  var date = req.body.date;
  var demands = req.body.demands;
  var demandMet = req.body.demandsMet;
  var id = req.body.id;
  var randomCode = req.body.randomCode;
  var recEmail = req.body.recEmail;
  var recName = req.body.recName;
  var time = req.body.time;
  var title = req.body.title;
  var image = req.body.image;

  //for SMTP feature
  var emailTransporter = emailer.createTransport('smtps://blackmailappcpsc473%40@gmail.com:cpsc12345!@smtp.gmail.com');  
  var mailOptions = {
    from: 'Blackmailapp Admin <blackmailappcpsc473@gmail.com>',
    to: recEmail,
    subject: 'Blackmail Arrived!',
    html: '<h1>'+ title + '</h1>' + '<h3>From: ' + recName + '<br>' + '<h3>Release Date: ' + date + ' ' + time + '<h3>Demands: ' + demands + '<h3>Image' + image
  };
  
  emailTransporter.sendMail(mailOptions, function(error, info){
     if(error){
         return console.log(error);
     } 
     console.log('Message Sent!');
  });
  res.status(200).end();
});
