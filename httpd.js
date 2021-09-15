var http = require("http");

var server = http.createServer((req, res) => {
  console.log(req.method + " " + req.url + " " + req.httpVersion);
  res.send("hello word !");
  res.end();
});

server.listen(8000);
