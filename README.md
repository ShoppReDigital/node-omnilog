# OmniLog

#### Installation:
 
```shell script
npm i @shoppre/omnilog --save
```

#### Usage:

```js
const omnilog = require('@shoppre/omnilog');

const express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

omnilog.init(app, { OMNILOG_DSN: 'http://localhost:8800/projectname', logger: console | winstonLogger })

```

- Server - [github.com/shoppre/omnilog](https://github.com/shoppre/omnilog)
