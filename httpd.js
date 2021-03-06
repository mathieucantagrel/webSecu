var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");

let configFile = require("./config.json");
const { parse } = require("querystring");

var server = http.createServer((req, res) => {
  getRequestInformations(req);

  let parsedUrl = url.parse(req.url, true);
  let requestedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  console.log(requestedPath);

  switch (requestedPath) {
    case configFile.route.information.path:
      infoRoute(req, res);
      break;

    case configFile.route.default.path:
      defaultRoute(req, res, requestedPath);
      break;

    default:
      let pathExtension = path.extname(requestedPath);
      if (pathExtension !== "") {
        defaultRoute(req, res, requestedPath);
        return;
      }
      res.writeHead(404, { "Content-type": "text/html" });
      res.write("<h1>404 : route not found</h1>");
      res.end();
      break;
  }
});

server.listen(configFile.port);

function defaultRoute(req, res, requestedPath) {
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
}

function infoRoute(req, res) {
  let file = "./templates/" + configFile.route.information.template;
  fs.readFile(file, function (err, content) {
    res.writeHead(200, { "Content-type": "text/html" });
    let method = req.method;
    let parsedUrl = url.parse(req.url, true);
    res.write(
      populateContentInfo(
        content.toString(),
        parsedUrl.pathname,
        method,
        parsedUrl.search,
        new url.URLSearchParams(parsedUrl.search)
      )
    );
    res.end();
  });
}

function populateContentInfo(content, pathname, method, args, queries) {
  let contentToSend = content;

  pathname = sanatizeString(pathname);
  method = sanatizeString(method);
  args = sanatizeString(args);

  contentToSend = contentToSend.replace("{{method}}", method);
  contentToSend = contentToSend.replace("{{path}}", pathname);
  contentToSend = contentToSend.replace("{{query}}", args);

  let queriesToPrint = "";
  for (entry of queries.entries()) {
    entry[0] = sanatizeString(entry[0]);
    entry[1] = sanatizeString(entry[1]);
    queriesToPrint += "<li>" + entry[0] + ":" + entry[1] + "</li>";
  }

  contentToSend = contentToSend.replace("{{queries}}", queriesToPrint);

  return contentToSend;
}

function sanatizeString(str) {
  if (str === null) return;

  return str
    .replace(/&/g, "&amp")
    .replace(/</g, "&lt")
    .replace(/\>/g, "&gt")
    .replace(/\"/g, "&quot")
    .replace(/\'/g, "&#x27");
}

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
  try {
    let mimeType = getMimeType(requestedPath);

    console.log("mime-type: ", mimeType);

    res.writeHead(200, { "Content-type": mimeType });
    res.write(content);
    res.end();
  } catch (error) {
    res.writeHead(404, { "Content-type": "text/html" });
    res.write("<h1>404 : file not found</h1>");
    res.end();
  }
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

function getRequestInformations(req) {
  console.log(req.method);
  console.log(req.url);

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      let bodyParsed = parse(body);
      console.log("email: ", bodyParsed.email);
      console.log("password: ", bodyParsed.password);
    });
  }
}
