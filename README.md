# LogBoard

#### Installation:
 
```shell script
npm i @shoppre/logboard --save
```

#### Usage:

```js
const logboard = require('@shoppre/logboard');

const express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

logboard.init(app, { LOGBOARD_DSN: 'http://localhost:8800/projectname', logger: console | winstonLogger })

```

- Server - [github.com/shoppre/logboard](https://github.com/shoppre/logboard)
