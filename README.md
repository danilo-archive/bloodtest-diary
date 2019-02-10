# BLOOD TEST DIARY

## Requirements

For development, you will only need Node.js and npm installed on your environement.

### Node and npm

[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/).
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

## Install
client:
```
    $ git clone https://github.kcl.ac.uk/k1764125/BloodTestDiary.git
    $ cd BloodTestDiary/client
    $ npm install
```

server:
```
    $ git clone https://github.kcl.ac.uk/k1764125/BloodTestDiary.git
    $ cd BloodTestDiary/server
    $ npm install
```

### Configure app
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

## Languages & tools

### HTML

### JavaScript
- [NodeJS](https://nodejs.org) is used for the back-end.
- [React](http://facebook.github.io/react) is used for UI
- [Electron](https://electronjs.org/) is used for deploying the desktop app

### CSS

### MYSQL

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
