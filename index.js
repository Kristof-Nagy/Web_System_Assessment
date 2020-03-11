var http = require("http");
fs = require("fs");
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("our app is running on port ${PORT}");
});

http.createServer(function(req, res))
{
  res.writeHead(200, {"Content-Type": "text/plain",
		      "Access-Control-Allow-Origin:" : "*"});

  var readStream = fs.createReadStream(__dirname , "/index.html");
  readStream.pipe(res);
}).listen(PORT);



console.log("Server running at http:something");
