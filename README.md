# OmniLog

#### Installation:
 
```shell script
npm i @shoppredigital/omnilog --save
```

#### Usage:

```js
const omnilog = require('@shoppredigital/omnilog');

const express = require('express'),
    bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

omnilog.init(app, { OMNILOG_DSN: 'http://localhost:8800/projectname', logger: console | winstonLogger })

```

- Server - [github.com/shoppredigital/omnilog](https://github.com/shoppredigital/omnilog)
