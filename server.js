// load the express package and create our app
var express = require('express');
var app     = express();
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

const PORT = process.env.PORT || 8080;
// set the port based on environment (more on environments later)
var port    = PORT;
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const mongoose = require("mongoose");

var store = new MongoDBStore({
	uri:"mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Logins?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin",
	collection:"Users"
})


app.use(session({secret:"398zrhauwh4tliasdf", cookie: { maxAge: 1000 * 60 * 60}, store: store, resave:false, saveUninitialized:true}));
app.disable('etag');

// DATABASE

const MongoClient = require('mongodb').MongoClient;
const logins_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Logins?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";
const game_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Game?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";
const client = new MongoClient(logins_uri, { useNewUrlParser: true });
const gane_client = new MongoClient(game_uri, { useNewUrlParser: true });



const { Schema } = mongoose;

const loginSchema = new Schema({
	username: String,
	password: String,
}, { collection: "Users" });

const User = mongoose.model("Users", loginSchema);


const gameSchema = new Schema({
	nickname: String,
	score: String,
}, { collection: "Score" });

const Game = mongoose.model("Score", gameSchema);

function Find_User(usern, res)
{
	mongoose.connect(logins_uri, { useNewUrlParser: true });

	User.findOne({username:usern, password:passw}, function(error, user){
		if (error)
        	{
			return res.status(500).send();
			//console.log("500");
        	}

		if (user)
		{
			//console.log("200");
			return res.json(user);
		}

		if (!user)
	        {
			return res.status(404).send("Username or password is wrong!");
			//console.log("404");
	        }
	})
}


function Add_User(usern, passw, res)
{
	mongoose.connect(logins_uri, { useNewUrlParser: true });

	const user = new User({ username:usern, password:passw });
	user.save((error) => {
		if (error)
		{
			console.log(error);
		}
		console.log("Saved 1 instance to database");
		return res.status(200).sendFile(__dirname + '/index.html');
	});
}

function Login_Authentication(usern, passw, req, res)
{
	mongoose.connect(logins_uri, { useNewUrlParser: true });

	User.findOne({username:usern, password:passw}, function(error, user){
		console.log(user);
		if (error)
        	{
			return res.status(500).send();
			console.log("500");
			//return false;
        	}

		if (user)
		{
			console.log("200");
			req.session.user = user;
			return res.redirect("/game");
		}

		if (!user)
	        {
			return res.status(404).send("Username or password is wrong!");
			console.log("404");
			//return false;
	        }
	})
}

function Add_Score (nickname, score, res)
{
	mongoose.connect(game_uri, { useNewUrlParser: true });

	const game_score = new Game({ nickname:nickname, score:score });
	game_score.save((error) => {
		if (error)
		{
			console.log(error);
		}
		console.log("Saved 1 instance to database");
		return res.status(200);
	});

}


// END OF DATABASE


// send our index.html file to the user for the home page
app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
      });

app.use(express.static("public"));

app.route('/login')
 .get(function(req, res) {
  res.sendFile(__dirname + "/login.html");
 })
 .post(urlencodedParser, function(req, res) {
  const nickname = req.body.nickname;
  const password = req.body.pswd;

  Login_Authentication(nickname, password, req, res);
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

  Add_User(nickname, password, res);
 });

app.route("/about_us")
 .get(function(req, res) {
   res.sendFile(__dirname + "/about_us.html")
 });

app.route("/game")
 .get(function(req,res) {
	res.sendFile(__dirname + "/game.html")
 })

app.route("/highscore")
 .get(function(req,res) {
 	res.sendFile(__dirname + "/highscore.html");
 });

app.route("/user")
 .get(function(req,res) {
	//res.json(Find_User(req.session.user.username))
	res.json( req.session.user.username )
 });

app.route("/logout")
 .get(function(req, res){
	req.session.user = null;
	console.log(req.session.user);
	res.redirect('/');
 });

app.route("/score")
 .post(urlencodedParser,function(req,res){
	const nickname = req.body.nickname;
	const score = req.body.score;

	Add_Score(nickname, score, res);
	//res.json( { nickname:nickname, score:score } );
	//res.status(200).send(nickname + " " + score);
 });

// start the server
app.listen(PORT, function(){
 console.log('Express Server running at http://127.0.0.1:'.PORT);
});


/*

BACKUP PLAN (OLDER ONE) ********************


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
			console.log(res);
			console.log("NULL");
		}
	      else {
			console.log(res);
			console.log("NOT NULL");
		}
              //console.log(res);
              db.close();
            });
        });
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
*/
