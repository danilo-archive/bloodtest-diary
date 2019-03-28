### Install Dependencies
```
 $ npm i
```

### Run app
```
 $ npm run electron-dev
```

### Package app into executable
```
$ npm run electron-pack
```
Disclaimer: The team configured the basics in order to be able to easily pack the app into
an executable file. That said, some remote connection and cookie configuration are still not available in
production environment.

To try how the packed version feels it would be necessary to hard code a localhost connection to the server into serverConnect.js
