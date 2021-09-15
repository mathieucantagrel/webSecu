var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");

let configFile = require("./config.json");

var server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);
  let requestedPath = parsedUrl.path.replace(/^\/+|\/+$/g, "");

  if (requestedPath === "") {
    fs.readdirSync(configFile.defaultDirectory).forEach((file) => {
      if (file === configFile.defaultFile) {
        requestedPath = configFile.defaultFile;
      }
    });
  }
  console.log("requested path: " + requestedPath);

  if (requestedPath === "") {
    noDefaultFile(res);
  }

  let file = configFile.defaultDirectory + requestedPath;
  fs.readFile(file, function (err, content) {
    sendContent(res, err, content, requestedPath);
  });
});

server.listen(configFile.port);

function noDefaultFile(res) {
  res.writeHead(200, { "Content-type": "text/html" });
  res.write("<ul>");
  fs.readdirSync(configFile.defaultDirectory).forEach((file) => {
    res.write("<li>" + file + "</li>");
  });
  res.write("</ul>");
  res.end();
}

function sendContent(res, err, content, requestedPath) {
  if (err) {
    res.writeHead(404);
    res.end();
  }

  let mimeType = getMimeType(requestedPath);

  console.log("mime-type: ", mimeType);

  res.writeHead(200, { "Content-type": mimeType });
  res.write(content);
  res.end();
}

function getMimeType(requestedPath) {
  switch (path.extname(requestedPath)) {
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    default:
      return "text/html";
  }
}
