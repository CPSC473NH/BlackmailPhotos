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
app.get("/hello", function (req, res) {
  res.send("Hello World!");
});
app.get("/goodbye", function (req, res) {
  res.send("Goodbye World!");
});
app.post('/upload', upload.single('image'), function(req,res){
  console.log(req.file);
  console.log(req.body); // form fields
  console.log(req.files); // form files
  res.status(204).end()
});