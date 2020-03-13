// load the express package and create our app
var express = require('express');
var app     = express();
const PORT = process.env.PORT || 8080;
// set the port based on environment (more on environments later)
var port    = PORT;
// send our index.html file to the user for the home page
app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
      });

app.use(express.static("public"));

app.route('/login')
 // show the form (GET http://localhost:PORT/login)
 .get(function(req, res) {
 res.sendFile(__dirname + "/login.html");
 })
 // process the form (POST http://localhost:PORT/login)
 .post(function(req, res) {
 var input1 = req.query.input1;
 var input2 = req.query.input2;

 console.log("The params:" + input1 + " " + input2);
 res.send('processing the login form!');
 });

app.route("/register")
 .get(function(req, res) {
 res.sendFile(__dirname + "/register.html");
 })
 .post(function(req, res) {
 res.send("processing the register form!");
 });

app.route("/about_us")
 .get(function(req, res) {
 res.sendFile(__dirname + "/about_us.html")
 });

// start the server
app.listen(PORT, function(){
 console.log('Express Server running at http://127.0.0.1:'.PORT);
})
