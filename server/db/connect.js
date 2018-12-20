const mongoose = require('mongoose');
const config = require('../config');

const log = require('../libs/log')(module);

const DB_USER = config.get('DB_USER');
const DB_SECRET = config.get('DB_SECRET');
const DB_HOST = config.get('DB_HOST');
const DB_NAME = config.get('DB_NAME');

const connect = () => mongoose.connect(
  `mongodb://${DB_USER}:${DB_SECRET}@${DB_HOST}/${DB_NAME}`,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      log.error('DB is not connected');
      process.exit(1);
    }
  }
);


module.exports = connect;
