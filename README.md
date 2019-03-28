# BLOOD TEST DIARY

## Requirements

For development, you will only need [Node.js](http://nodejs.org/) and [npm](https://npmjs.org/) installed on your environment.

### Node and npm

[Node](http://nodejs.org/) is really easy to install & now include [npm](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.
```
    $ node --version
    v11.6.0

    $ npm --version
    6.7.0
```

#### Node installation on OS X

You will need to use a Terminal. On OS X, you can find the default terminal in
`/Applications/Utilities/Terminal.app`.

Please install [Homebrew](http://brew.sh/) if it's not already done with the following command.

    $ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

If everything when fine, you should run

    $ brew install node

#### Node installation on Linux

    $ sudo apt-get install python-software-properties
    $ sudo add-apt-repository ppa:chris-lea/node.js
    $ sudo apt-get update
    $ sudo apt-get install nodejs

#### Node installation on Windows

Just go on [official Node.js website](http://nodejs.org/) & grab the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it.

<hr>

### How to use code quality and testing tools

#### ESLint:
**Currently only used for node backend support**

To check ```path/to/app.js```:

    $ npm run -s eslint path/to/app.js
It is advised to install editor extensions which will allow to check for errors automatically.
VSCode: [vscode-eslint](https://github.com/Microsoft/vscode-eslint)
Atom: [linter-eslint](https://atom.io/packages/linter-eslint)

#### Mocha, Chai, and Instanbul

To recursively run tests in ```server/```:<br>
```
    $ cd server
    $ npm test
```
To recursively run tests in ```client/```<br>
```
    $ cd client
    $ npm test
```

<hr>

### Configure app
#### Server connection
The configuration file is ```client/config/app_config.json```

```port``` : the port on which the local app runs<br>
```staticFolder``` : the static folder containing the frontend app<br>
```indexFile```: the index.html file which is served when the app receives get requests<br>

```
{
    "port" : 4200,
    "staticFolder" : "/public",
    "indexFile" : "index.html"
}
```
<hr>

#### Email sender
The configuration file is ```server/config/email_config.json```
```
{
    "transporter": {
        "host": "smtp.mail.yahoo.com",
        "port": 465,
        "service": "yahoo",
        "secure": false,
        "auth": {
            "user": "example@yahoo.com",
            "pass": "password"
        },
        "logger": true
    }
    /.../
}
```
for info on usage and possible additional settings, go to [nodemailer.com](https://nodemailer.com/smtp/)

# Instructions for running

To run the application follow these steps:

1. First a database needs to be set up. For this use `schema.sql` and `insert.sql` files in `server/database/` folder.
2. You might have to configure some files in `server/config/` folder.
3. Then go to `server/` folder and first run `npm install` command. Then run `npm start`. The server is now running.
4. Now you have two options for running the application. You can simply run the .exe file provided in `builds/` folder and continue from step 7.
5. Another option is running it in development mode. Go to `client/` folder and run `npm i`.
6. Then run `npm run electron-dev`.
7. The application is now running. If the application does not automatically connect to the server, you can update the IP and port in the top right corner.

## Languages & tools

- [NodeJS](https://nodejs.org) is used for the back-end.
- [React](http://facebook.github.io/react) is used for UI
- [Electron](https://electronjs.org/) is used for deploying the desktop app
- [ESLint](https://eslint.org/) is used for linting support
- [Mocha](https://mochajs.org/) is used for testing
- [Chai](https://www.chaijs.com/) is used for assertions
- [Instanbul](https://istanbul.js.org/) is used for test branch coverage checks
- [nodemailer](https://nodemailer.com/) is used for sending emails
- [mysql](https://www.npmjs.com/package/mysql) for managing and creating a relational database
- [mocha-sinon](https://www.npmjs.com/package/mocha-sinon) used for integration between mocha and sinon, allowing for automatic cleanup of spies
- [proxyquire](https://www.npmjs.com/package/proxyquire) used to proxy nodejs's require in order to make overriding dependencies
- [mjml] (https://mjml.io/) used for email formatting

<hr>

## Authors

* [Alessandro Amantini]()      
* [Alvaro Rausell Guiard]()  
* [Danilo Del Busso]()  
* [Emilio Pascarelli]()  
* [Jacopo Madaluni]()  
* [Jakub Cerven]()  
* [Luka Kralj]()  
* [Mateusz Nowak]()  
