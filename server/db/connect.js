const mongoose = require('mongoose');
const config = require('../config');

const log = require('../libs/log')(module);

const DB_USER = config.get('DB_USER');
const DB_SECRET = config.get('DB_SECRET');
const DB_HOST = config.get('DB_HOST');
const DB_NAME = config.get('DB_NAME');

const dbURL = `mongodb://${DB_USER}:${DB_SECRET}@${DB_HOST}/${DB_NAME}`;


const connect = () => {
  mongoose.connect(dbURL, { useNewUrlParser: true });

  mongoose.connection.on('connected', () => {
    log.info('Mongoose connection is open');
    config.set('dbConnected', true);
  });

  mongoose.connection.on('error', function (err) {
    log.error('Mongoose connection has occured ' + err + ' error');
    config.set('dbConnected', false);
  });

  mongoose.connection.on('disconnected', function () {
    log.warn('Mongoose connection is disconnected');
    config.set('dbConnected', false);
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      log.warn('Mongoose connection is disconnected due to application termination');
      config.set('dbConnected', false);
      process.exit(0)
    });
  });
};

module.exports = connect;
