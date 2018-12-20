const winston = require('winston');
// const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const { combine, timestamp, label, printf, colorize, json } = winston.format;

const myFormat = printf(info => {
  return `${!isDev ? info.timestamp : ''} ${info.level}: [${info.label}] ${info.message}`;
});

function getLogger(module) {



  const pathShort = module.filename.split('/').slice(-2).join('/');
  const pathToFile = 'combined.log';

  console.log('pathToFile', pathToFile);

  return winston.createLogger({
    level: isDev ? 'info' : 'info',
    format: combine(
      colorize(),
      label({ label: pathShort }),
      timestamp(),
      json(),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: pathToFile,
        level: 'info',
        timestamp: true
      })
    ]
  })

}

module.exports = getLogger;
