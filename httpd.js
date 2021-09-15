var http = require("http");

var server = http.createServer((req, res) => {
  res.setHeader("200", {
    "Content-type": "text/html",
  });
  res.write("<html><body><h1>Hello World!</h1></body></html>");
  res.end();
});

server.listen(8000);
