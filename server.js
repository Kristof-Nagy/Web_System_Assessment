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

// Add Username & Password

const MongoClient = require('mongodb').MongoClient;
const logins_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Logins?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";
const game_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Game?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";
//const client = new MongoClient(uri, { useNewUrlParser: true });

function Login_Validation(usern, passw)
{
   MongoClient.connect(logins_uri, function (err, db) {
            if(err) throw err;
            //Write databse Insert/Update/Query code here..
            var dbo = db.db("Logins");
            var looking_for = { username:usern, password:passw };
            dbo.collection("Users").findOne(looking_for, function(err, res) {
              if (err) throw err;
	      if (res == null)
		{
			return false;
		}
              console.log(res);
              db.close();
            });
        });

   return true;
}


function Add_Server_Username_Password (usern, passw)
{
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
 const nickname = req.body.nickname;
 const password = req.body.pswd;

 if (Login_Validation(nickname, password) == true)
 {
	console.log("INSIDE");
 }
 else{
	console.log("NOT INSIDE");
 }



 //console.log(req.body);
 //res.send(req.body.nickname + " " + req.body.pswd);
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

  Add_Server_Username_Password(nickname, password);
  //res.send(firstname + " " + lastname + " " + password);
 });

app.route("/about_us")
 .get(function(req, res) {
 res.sendFile(__dirname + "/about_us.html")
 });

// start the server
app.listen(PORT, function(){
 console.log('Express Server running at http://127.0.0.1:'.PORT);
});
