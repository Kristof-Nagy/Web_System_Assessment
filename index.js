const PORT = process.env.PORT || 8080;
var http = require ("http");

app.listen(PORT, () => {
  console.log("our app is running on port ${PORT}");
});

http.createServer(function(req, res))
{
  response.writeHead(200, {"Content-Type": "text/plain"});

  response.end("Hello World \n");
}).listen(PORT);



console.log("Server running at http:something");
