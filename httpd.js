var http = require("http");
var fs = require("fs");

var server = http.createServer((req, res) => {
  let file = __dirname + "/public/index.html";
  fs.readFile(file, function (err, content) {
    if (err) {
      res.writeHead(404);
      res.end();
    }

    res.setHeader("200", {
      "Content-type": "text/html",
    });
    res.end(content);
  });

  //   res.end();
});

server.listen(8000);
