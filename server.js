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

/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Tofu:tofu@websystemcluster-gbe8g.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
*/
// Add Username & Password

const MongoClient = require('mongodb').MongoClient;
const logins_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Logins?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";
const game_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Game?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";
const client = new MongoClient(uri, { useNewUrlParser: true });


function Add_Server_Username_Password (usern, passw)
{
   /*client.connect(err => {
   const collection = client.db("Logins").collection("Users");
   collection.insertOne({username:usern, password:passw});
   client.close();
   });
*/
   MongoClient.connect(logins_uri, function (err, db) {
            if(err) throw err;
            //Write databse Insert/Update/Query code here..
            var dbo = db.db("Logins");
            var myobj = { username: usern, password: passw };
            dbo.collection("Users").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 user inserted");
              db.close();
            });
        });
}

function Add_Server_Username_Score(usern, score)
{
   MongoClient.connect(game_uri, function (err, db) {
            if(err) throw err;
            //Write databse Insert/Update/Query code here..
            var dbo = db.db("Logins");
            var myobj = { username: usern, score: score };
            dbo.collection("Score").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 score inserted");
              db.close();
            });
        });
}

/*
var r_username = "will need to retrieve from client";
var r_password = "this is password";

var r_user = "a user";
var r_score = "32";

client.connect(err => {
  const collection = client.db("Logins").collection("Users");
  const collection2 = client.db("Game").collection("Score");

  collection.insertOne({username:r_username, password:r_password});
  collection2.insertOne({user:r_user, score:r_score});

  client.close();
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
 .post(urlencodedParser, function(req, res) {

 console.log(req.body);
 res.send(req.body.nickname + " " + req.body.pswd);
 });

app.route("/register")
 .get(function(req, res) {
  res.sendFile(__dirname + "/register.html");
 })
 .post(urlencodedParser, function(req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const nickname = req.body.nickname;
  const password = req.body.pswd;

  Add_Server_Username_Password(firstname, lastname);
  res.send(firstname + " " + lastname + " " + password);
 });

app.route("/about_us")
 .get(function(req, res) {
 res.sendFile(__dirname + "/about_us.html")
 });

// start the server
app.listen(PORT, function(){
 console.log('Express Server running at http://127.0.0.1:'.PORT);
});
