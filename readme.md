# Web security

## Assignment 1 - CANTAGREL Mathieu

## My first web app

This web app has been developped using node.js. To use it,clone the repository, then use the following command in your terminal `node httpd.js`. The server is listening to the port `8000`. To see the web server in action go to your web browser and type `localhost:8000` or `127.0.0.1:8000`.

The version you have downloaded is the protected version of the web app. To access the un protected version, please checkout to the following commit : `cf9f0334`. If you don't know how to do it, here is the command to run in your terminal : `git checkout cf9f0334`. If you want to go back to the last version of the code, checkout to `main`, using: `git checkout main`.

## Denial of service

### Video of the attack

[dosAttack-2021-09-18_10.53.03.mp4](https://drive.google.com/file/d/1c0F4t8Cf3uoSSAvL1Mzzeno7ICfzn2s5/view?usp=sharing)

### The attack

As you can see on the video, the attack has been performed by trying to access something that doesn't exists in the application.

The server has tried to access something that doesn't exists resulting in a crash of it. This is true for any route that is not `/` or `/information` as well as any file that does not exists.

### The protection

Reminder: each response from a request has a status code. For example when everything is alright, the status code is : `200`. When the user is trying to access something that the server does not find, the status code `404`.

To protect the server from this type of attack, we can at first create a `404` page for the routes. If the user tries to access a route that does not exists he will see a `404` page telling him that the route does not exists. By doing this every non valid route is, actually, a route it self that serves a `404` page. By doing this the server now never crash due to a route that does not exists.

Then to protect from accessing file that does not exists. When the server receives a new request for a file, it is automatically routed to the default route. Then, the portion of code that is supposed to serves is inside a `try catch` statement. If the file does not exist, it result into an error that is caught by the `catch` statement, and the server serves a `404` page without crashing. If the file exists, the server serves it as usual.

## XSS

### Video of the xss attack

[xssAttack-2021-09-18_10.51.07.mp4](https://drive.google.com/file/d/1y4eh9Y9Zq7lBxKVQZ_qAd0k_7LSIgoAW/view?usp=sharing)

### The xss attack

As you can see on the short video, the attack is performed using the url. The web server uses the url to retrieve information and to display them. This is a weakness that has been used. The server displays the raw information in the web page. So it is possible to put tag in the url that will be interpreted not as strings but as actual tags. On the video, you can see that the attacker put a `<script>` tag in the url. These are tags to run javascript. When the attacker send this code to the server, it sends backs the response but with the malicious javascript that is going to run into the web page. Here the attackers has run just an `alert()` function, but it is easy to imagine more dangerous situation.

### The protection from xss

Protecting a website from xss is not simple. Here, to protect the web server from this type of attack I have used a technique to "sanitise" the user input. To do so, the server uses the `replace()` function in javascript. This function works as following : `str.replace(regex, replacement)` the replace function will act on the `str` variable, scan for the regex that has been in argument, and each time the regex is found, it replaces it by the `replacement` variable. This allows us to replace anything that can make xss working, such as tag. But, we are not going to look for specific tag as there are plenty of them, we are going to look for `<`, `>`, as this is what define tags as tags. And the rafters will be replace by their html hex code. By doing this, they will appear on the web page but not interpreted as actual chevron.

To conclude, the web server does prevent the malicious from running by making anything that can by interpreted as a tag, just a plain string. The user input has been sanitised.
