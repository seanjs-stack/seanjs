![alt tag](http://www.seanjs.org/modules/core/client/img/brand/logo.png)

```bash
Pronounced as SEEN.JS
```

[![Documentation Status](https://readthedocs.org/projects/seanjs/badge/?version=latest)](http://seanjs.readthedocs.org/en/latest/?badge=latest)
[![Join the chat at https://gitter.im/seanjs-stack/seanjs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/seanjs-stack/seanjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/seanjs-stack/seanjs.svg?branch=master)](https://travis-ci.org/seanjs-stack/seanjs)
[![Dependencies Status](https://david-dm.org/seanjs-stack/seanjs.svg)](https://david-dm.org/seanjs-stack/seanjs)
[![bitHound Overall Score](https://www.bithound.io/github/seanjs-stack/seanjs/badges/score.svg)](https://www.bithound.io/github/seanjs-stack/seanjs)
[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)](http://seanjs.herokuapp.com)
[![Built with Grunt](https://img.shields.io/badge/built%20with-GRUNT-orange.svg)](http://gruntjs.com/)

[![NPM](https://nodei.co/npm/generator-seanjs.png?downloads=true&downloadRank=true)](https://nodei.co/npm/generator-seanjs/)

**SEAN.JS** is a Full-Stack Javascript for an easy starting point with [**S**equilizeJS](http://sequelize.readthedocs.org/en/latest/), [**E**xpressJS](http://expressjs.com/), [**A**ngularJS](https://angularjs.org/) and [**N**odeJS](https://nodejs.org/en/) based applications.
It is designed to give you a quick and organized way to start developing SEAN based web apps.

## Configured with
* [RedisStore](https://github.com/optimalbits/node_acl): Redis session store backed by node_redis, and is insanely fast!
* [ACL](https://github.com/optimalbits/node_acl): An Access Control List module, based on Redis with Express middleware support
* [Async](https://github.com/caolan/async): Higher-order functions and common patterns for asynchronous code
* [Passport](https://github.com/jaredhanson/passport): Simple, unobtrusive authentication for Node.js (Facebook, Twitter, LinkedIn, Google and PayPal)
* [Socket.io](https://github.com/socketio/socket.io): Node.js realtime framework server
* [reCaptcha](https://www.google.com/recaptcha/intro/index.html): Tough on bots Easy on humans
* [Nodemailer](https://github.com/andris9/Nodemailer): Send e-mails with Node.JS – easy as cake!
* And many more...

Based on **MEAN Stack**

---

### Live Example: [http://seanjs.herokuapp.com](http://seanjs.herokuapp.com)

---
### For quick development and deployment:

**Install:**
* [Docker](https://docs.docker.com/installation/#installation)
* [Docker Compose](https://docs.docker.com/compose/install/)


Using Docker, you don't have to install any prerequisites on your machine.
Just install [Docker](https://docs.docker.com/installation/#installation), run `docker-compose up` and you are up and running!

You will have these containers created for you:

* Nodejs (4.2.3)
* PostgreSQL (Latest)
* Redis (Latest)


Local development and testing with compose:
```bash
$ docker-compose up
```

> Note: You might need to try this command `eval "$(docker-machine env default)"` in the project directory root to activate Docker

*By default, the url will be: [http://192.168.99.100:3000](http://192.168.99.100:3000)*

---

### Installation

### Before you start, make sure you have these prerequisites installed:

 * PostgreSQL 9.4 or MySQL, MariaDB, SQLite and MSSQL *(Depending on your project but SEAN.JS defaults to PostgreSQL 9.4)*
 * Redis Server
 * Node.js
 * NPM

---

##### Using Yeoman Generator:

Check [SEAN.JS Stack Official Yeoman Generator](https://www.npmjs.com/package/generator-seanjs)

```sh
$  npm install -g yo
```
**Note:** Your user might not have the permissions to install package globally, so use a super user or **sudo**.

Once you have *yo* installed, you will need to install the **SEAN.JS** Stack generator as well:

```bash
$  npm install -g generator-seanjs
```

```bash
$ yo seanjs
```

You are now ready to get started with the SEAN.JS generator. The generator will help you create a SEAN application.

---

##### Using Command Line:

> **For MySQL, MariaDB, SQLite and MSSQL**

> Please replace:
* [user.server.model.js](https://gist.github.com/Massad/3986f4b12d871de8d353#file-user-server-model-js-L6) with `/modules/users/server/models/user.server.model.js`
* [user.authentication.server.controller.js](https://gist.github.com/Massad/f6f649d60ad3009f7b99#file-user-authentication-server-controller-js-L6) with `/modules/users/server/controllers/users/user.authentication.server.controller.js`


> And update your database in the `config/env/`

```bash
$ git clone https://github.com/seanjs-stack/seanjs.git seanjs
```
```bash
$ cd seanjs
```

```bash
$ sudo npm install -g bower
```

```bash
$ sudo npm install -g grunt-cli
```

```bash
$ sudo npm install
```
You might notice some `errors` but if you hit `node server.js` and it's working, simply ignore them.

```bash
$ bower install --alow-root
```

```bash
$ node server.js
```

---

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

* explore `config/env/development.js` for development environment configuration options

### Running in Production mode
To run your application with *production* environment configuration, execute grunt as follows:

```bash
$ grunt prod
```

* explore `config/env/production.js` for production environment configuration options

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ sh ./scripts/generate-ssl-certs.sh
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute grunt's prod task `grunt prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`


## Testing Your Application
You can run the full test suite included with SEANJS with the test task:

```bash
$ grunt test
```

This will run both the server-side tests (located in the app/tests/ directory) and the client-side tests (located in the public/modules/*/tests/).

To execute only the server tests, run the test:server task:

```bash
$ grunt test:server
```

And to run only the client tests, run the test:client task:

```bash
$ grunt test:client
```

---
## Heroku Database - Testing

After installing the **SEAN.JS** if you didn't setup the `postgresql` database yet.
You can run this command to run the application on a testing heroku database:

`DB_NAME="dfuue4lro8u0qk" DB_HOST="ec2-54-217-240-205.eu-west-1.compute.amazonaws.com" DB_USERNAME="xjwecgnyhogzdw" DB_PASSWORD="iH1awetnARl9-HltdMqMWuF0dN" DB_SSL=true node server.js`

And you can see the changes in the database also here http://seanjs.herokuapp.com

Look for `config/env/heroku_example.js` for more info

---
## DigitalOcean - One-Click Apps

This needs your votes! [UserVoice - Add SEAN.JS to One-Click Apps](https://digitalocean.uservoice.com/forums/136585-digitalocean/suggestions/10749723-add-sean-js-to-one-click-apps)

---
## Contribution

You are welcome to contribute to SEAN.JS Stack to keep it up to date and always improving!

Please check the [Contribution Info](https://github.com/seanjs-stack/seanjs/blob/master/CONTRIBUTING.md)
---

## Credits
Inspired by the great work of the [MEANJS](http://meanjs.org) team and indirectly by [Madhusudhan Srinivasa](https://github.com/madhums/)
The MEAN name was coined by [Valeri Karpov](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs)

The SEAN.JS (SEANJS) name is coined by [Omar Massad](https://github.com/Massad)

---

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
