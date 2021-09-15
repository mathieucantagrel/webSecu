var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");

var server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);

  let requestedPath = parsedUrl.path.replace(/^\/+|\/+$/g, "");

  if (requestedPath == "") {
    requestedPath = "index.html";
  }
  console.log("requested path: " + requestedPath);

  let file = __dirname + "/public/" + requestedPath;
  fs.readFile(file, function (err, content) {
    if (err) {
      res.writeHead(404);
      res.end();
    }

    let mimeType;
    switch (path.extname(requestedPath)) {
      case ".css":
        mimeType = "text/css";
        break;
      case ".js":
        mimeType = "text/javascript";
        break;

      default:
        mimeType = "text/html";
        break;
    }

    console.log("mime-type: ", mimeType);

    res.writeHead(200, { "Content-type": mimeType });
    res.write(content);
    res.end();
  });
});

server.listen(8000);
