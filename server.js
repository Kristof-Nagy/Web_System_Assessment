// load the express package and create our app
var express = require('express');
var app     = express();
const PORT = process.env.PORT || 8080;
// set the port based on environment (more on environments later)
var port    = PORT;
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// DATABASE

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Tofu:tofu@websystemcluster-gbe8g.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

/*MongoClient.connect(uri, function (err,client){
 console.log("Start the database stuff");
 var dbo = client.db("Scores");
 var obj = { username:"user 1", score:"0" };
 dbo.collection("GameScore").insertOne(obj, function(err, res){
  if (err) throw err;
  console.log("1 user inserted");
  client.close();
 });

 var dbo2 = client.db("Users");
 var obj2 = { username:"habanta", password:"paladin07" };
 dbo2.collection("UsersDetail").insertOne(obj2, function(err, res){
  if (err) throw err;
  client.close();
 });
 console.log("End the database stuff");
});
*/
// END OF DATABASE


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
 .post(urlencodedParser,function(req, res) {

 console.log(req.body);
 res.send(req.body.nickname + " " + req.body.pswd);
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
});
