var express = require("express"),
  http = require("http"),
  multer = require("multer"),
  app = express();
var upload = multer({ dest: './upload' });
// set up a static file directory to use for default routing
// also see the note below about Windows
app.use(express.static(__dirname));
// Create our Express-powered HTTP server
app.listen(8000, function () {
  console.log('Blackmail app listening on port 8000!');
});
// set up our routes
app.post('/upload', upload.single('image'), function(req,res){
  console.log(req.file);
  console.log(req.body); // form fields
  console.log(req.files); // form files
  res.send(req.file.filename);
  res.status(200).end()
});