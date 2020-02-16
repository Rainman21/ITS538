# REST
>NodeJSandExpress

We will be creating a REST API using NodeJS and an Express Server.  This is a very common, and there are many tutorials.  A good tutorial is at
https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9

To get going on a new NodeJS site, we need to create a JSON file that the site uses for configuration.

First confirm you have NodeJS installed. From a command prompt, type

```
node -v
```

You should get something like

```
>node -v v11.6.0
```

If you received an error, make sure you have installed NodeJS properly.  The easiest way is to just google NodeJS to locate not only the installer from NodeJS.org, but also a suitable video tutorial that matches your Mac/Windows/Linux platform

> Running the following command will get you going (it is OK to accept all the defaults)

```bash
npm init
```
Note that it had us define an index.js as the startup script - create one in your folder.

Open the index.js file and paste the following code in it. IF you need some help, we are basically following along with one of the examples in the NodeJS.org tutorial at https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm, however, we will deviate a bit...

```js
var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
```

Now run node index.js

```bash
>node index.js
```

If you get an error like 
>Error: Cannot find module 'express'

Then you don't have Express installed.

Go to the terminal install express. It is very important that you run this command from the path that your project is located in (same as package.json file), because the command installs the express application for this folder only.

```bash
>npm install express --save
 ```

You will notice a colorful display rendering in the terminal as it figures out everyting it needs and downloads to your computer... It stores what it downloaded in  _package-lock.json_ -- we will come to that in a second.

For now, note that the --save meant to put it in our _package.json_ file under _dependencies_

```json
{
  "name": "its538",
  "version": "1.0.0",
  "description": "To get going on a new NodeJS site, we need to create a JSON file that the site uses for configuration.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```
However, express application is large with many of its own dependencies which it put in the _package-lock.json_ file.  There are too many to show here, so just a snip below for the express entry itself. Each of its 'requires' may have their own dependencies.

```json
   "express": {
      "version": "4.17.1",
      "resolved": "https://registry.npmjs.org/express/-/express-4.17.1.tgz",
      "integrity": "sha512-mHJ9O79RqluphRrcw2X/GTh3k9tVv8YcoyY4Kkh4WDMUYKRZUq0h1o0w2rrrxBqM7VoeUVqgb27xlEMXTnYt4g==",
      "requires": {
        "accepts": "~1.3.7",
        "array-flatten": "1.1.1",
        "body-parser": "1.19.0",
        "content-disposition": "0.5.3",
        "content-type": "~1.0.4",
        "cookie": "0.4.0",
        "cookie-signature": "1.0.6",
        "debug": "2.6.9",
        "depd": "~1.1.2",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "finalhandler": "~1.1.2",
        "fresh": "0.5.2",
        "merge-descriptors": "1.0.1",
        "methods": "~1.1.2",
        "on-finished": "~2.3.0",
        "parseurl": "~1.3.3",
        "path-to-regexp": "0.1.7",
        "proxy-addr": "~2.0.5",
        "qs": "6.7.0",
        "range-parser": "~1.2.1",
        "safe-buffer": "5.1.2",
        "send": "0.17.1",
        "serve-static": "1.14.1",
        "setprototypeof": "1.1.1",
        "statuses": "~1.5.0",
        "type-is": "~1.6.18",
        "utils-merge": "1.0.1",
        "vary": "~1.1.2"
      }
    },
```
These files are all stored in the subfolder called _node_modules_ (50 total in this case).

## Express installed - Ready to run

Now we can run the app command 
> node index.js

```bash
>node index.js
Example app listening at http://:::8081
```

NOTE if you ever see this error, it is often becuase the URL of page doesn't match the server.  THis is most common when you are browsing a page like _file:/C:/file.html_ and trying to hit the server at _http://localhost:8080/(rest endpoint)_.  To remedy, make sure you are browsing the page at  _http://localhost:8080/file.html_

```bash
Access to fetch at 'http://localhost:8081/listusers' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

## Webpages calling REST APIs

As web browsers have evolved, so have their abilities to make asyncronous calls, often refered to by their original acronym "AJAX" for asyncronous Javascript and XML.  What do we mean by asynchronous? It just means that the web page 'execution' -- what happens after a button press, page refresh, etc., doesn't wait for the server to respond before moving on.  Rather it says _please go handle this request of mine, and when you are done, please call this other method.  

For example:
 >Fetch the shopping cart count for the user, when done update my icon

It might look something like this:

> FetchUserCart(carturl, updateCartIcon(usercart.itemCount))

We call the _updateCartIcon(item)_ a callback -- it is a function waiting for the http request to complete, and be called with the response...

All is well if the http request is responded to, but what happens if the URL is down, or the network drops, or it responds with a different object, or your credentials are refused?  The method may never be called, and thus how do you determine if there is an error?

## Promises

> documentation can be found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises

Recent design patterns called 'promises' are now commonly used: you send them a request along with a success callback _and_ a fail callback.  It returns a promise object that you can optionally latch onto with your own success and error functions:

It looks something like this:  

> function getShopingCart() returns Promise< ShopingCart >

If you call this function, you can latch onto so that when it succeeds, it calls the then function, and if it fails, it calls the catch function.  Typically, a call might look like the following... note that the object passed to the then method is a ShopingCart, but the catch method receives

> getShopingCart().then((cart)=> displayCart(cart)).catch((err) ==> console.error(err));

## AJAX == Fetch

The Javascript Fetch method is relatively new, but it wraps the http request to your REST interface in a promise

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

## Example Fetch

```js
  function showUsers() {
    getUsers().then((users) => {
      document.getElementById('userlist').innerHTML =
        JSON.stringify(users, undefined, 2)
    });
  function getUsers(){
    // note that we RETURN a promise (which is what fetch returns)
    return fetch('http://localhost:8081/listusers')
        .then((response) => {
          return response.json() //converts response to JSON
        })
        .then((myJson) => {
          console.log(myJson) //logs the JSON object from prev .then
          return myJson //This is what is RETURNED = Promise<JSON>
        })
        .catch((err) =>{
          console.log (err)  //only if the fetch fails or times out
        })
      }
  
```