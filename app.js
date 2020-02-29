const { CORS_TRUST } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('./db/connect');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  }),
);

app.use((_req, res, next) => {
  //TODO: * => client URL
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(
  cors({
    origin: CORS_TRUST.split(','),
    credentials: true,
  }),
);

const wwwPath = path.join(__dirname, '/bin/www');

app.get('/', express.static(wwwPath));

module.exports = app;
