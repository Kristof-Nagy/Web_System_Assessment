// load the express package and create our app
var express = require('express');
var app     = express();
var session = require("express-session");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var MongoDBStore = require("connect-mongodb-session")(session);
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var validator = require('validator');

const PORT = process.env.PORT || 8080;
var port = PORT;

var store = new MongoDBStore({
	uri:"mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Logins?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin",
	collection:"Users"
})

app.use(express.static("public"));
app.use(session({secret:"398zrhauwh4tliasdf", cookie: { maxAge: 1000 * 60 * 60}, store: store, resave:false, saveUninitialized:true}));


// DATABASE---------------------------------------------------------------------------------------------------------------------------------------
// ***********************************************************************************************************************************************
const MongoClient = require('mongodb').MongoClient;
const game_uri = "mongodb://Tofu:tofu@websystemcluster-shard-00-00-gbe8g.mongodb.net:27017,websystemcluster-shard-00-01-gbe8g.mongodb.net:27017,websystemcluster-shard-00-02-gbe8g.mongodb.net:27017/Game?ssl=true&replicaSet=WebSystemCluster-shard-0&authSource=admin";

//--------------------------------------------------
// Mongoose schemes for:
// - Login
// - Game
mongoose.connect(game_uri, { useNewUrlParser: true });

const { Schema } = mongoose;

const loginSchema = new Schema({
	username: String,
	password: String,
}, { collection: "Users" });

const User = mongoose.model("Users", loginSchema);


const gameSchema = new Schema({
	nickname: String,
	score: Number,
}, { collection: "Score" });

const Game = mongoose.model("Score", gameSchema);
// END SCHEMES-------------------------------------


// Functions:

// Add user
function Add_User(usern, passw, res)
{
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

// Add Score
function Add_Score (nickname, score, res)
{
	const game_score = new Game({ nickname:nickname, score:score });
	game_score.save((error) => {
		if (error)
		{
			console.log(error);
			return res.status(500).end();
		}
		console.log("Saved 1 instance to database");
		return res.status(200).end();
	});
}

// Login Authentication
function Login_Authentication(usern, passw, req, res)
{
	User.findOne({username:usern, password:passw}, function(error, user){
		console.log(user);
		if (error)
        	{
			return res.status(500).send();
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
	        }
	})
}

// Check for duplicate in database
function Check_Duplicates(usern, req, res)
{
	User.findOne({username:usern}, function(error, result){
		if (error)
		{
			return res.status(500).send();
		}

		if (result)
		{
			return res.status(300).send("DUPLICATE");
		}
	})
}


// Getting the scores from the database in an ordered list
function Order_By_Score(res) {
	Game.find({},null,{limit:5}).sort("-score").exec(function(err, result){
		if(err){
			return res.status(500).end();
		}
		console.log(result);
		return res.status(200).json(result);
	});
}
//***********************************************************************************************************************************************
// END OF DATABASE-------------------------------------------------------------------------------------------------------------------------------

//
// Pages
//


// Home Page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});


// Login Page
app.route('/login')
.get(function(req, res) {
	res.sendFile(__dirname + "/login.html");
})
 .post(urlencodedParser, function(req, res) {
	 const nickname = req.body.nickname;
	 const password = req.body.pswd;

	 Login_Authentication(nickname, password, req, res);
 });


// Register Page
app.route("/register")
.get(function(req, res) {
	res.sendFile(__dirname + "/register.html");
})
 .post(urlencodedParser, function(req, res) {

   //const nickname = req.body.nickname;
   //const password = req.body.pswd;

   const nickname = req.body[0];
   const password = req.body[1];

   var valid_input = validator.isAlpha(nickname, ["hu-HU"]);

   // checking if nickname or password is empty
   if (validator.isEmpty(nickname) == false && validator.isEmpty(password) == false)
   {
	Check_Duplicates(nickname,req,res);
   }
   else
   {
	res.setHeader('Content-Type', 'application/json');
	return res.status(300).send(JSON.stringify({answer: "valami hiba"}));
   }
   Add_User(nickname, password, res);
 });


// About Us Page
app.route("/about_us")
.get(function(req, res) {
	res.sendFile(__dirname + "/about_us.html")
});


// Game Page
app.route("/game")
.get(function(req,res) {
	res.sendFile(__dirname + "/game.html")
})


// Highscore Page
app.route("/highscore")
.get(function(req,res) {
	res.sendFile(__dirname + "/highscore.html");
});


// Getting all score from database in an ordered list
app.route("/all_scores_ordered")
.get(function(req,res){
	Order_By_Score(res);
});


// Get user session
app.route("/user")
.get(function(req,res) {
	res.json( req.session.user.username )
});


// Logging out: destroying session
app.route("/logout")
.get(function(req, res){
	req.session.user = null;
	console.log(req.session.user);
	res.redirect('/');
});


// Getting nickname and score, than add it to the database
app.route("/score")
.post(urlencodedParser,function(req,res){
	const nickname = req.body.nickname;
	const score = req.body.score;

	Add_Score(nickname, score, res);
});



// start the server
app.listen(PORT, function(){
 console.log('Express Server running at http://127.0.0.1:'.PORT);
});

