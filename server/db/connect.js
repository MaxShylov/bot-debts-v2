const mongoose = require('mongoose');

const log = require('../libs/log')(module);

const { DB_USER, DB_SECRET, DB_HOST, DB_NAME } = process.env;

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
