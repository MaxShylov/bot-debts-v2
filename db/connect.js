const { DB_USER, DB_SECRET, DB_HOST, DB_NAME } = process.env;

const mongoose = require('mongoose');

const dbURL = `mongodb://${DB_USER}:${DB_SECRET}@${DB_HOST}/${DB_NAME}`;

(() => {
  mongoose.connect(dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.info('Mongoose connection is open');
  });

  mongoose.connection.on('error', err => {
    // eslint-disable-next-line no-console
    console.error('Mongoose connection has occured ' + err + ' error');
  });

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('Mongoose connection is disconnected');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      // eslint-disable-next-line no-console
      console.warn(
        'Mongoose connection is disconnected due to application termination',
      );
      process.exit(0);
    });
  });
})();
