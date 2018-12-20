const winston = require('winston');
const isDev = process.env.NODE_ENV === 'development';

const { combine, timestamp, label, printf, colorize } = winston.format;

const myFormat = printf(info => {
  return `${!isDev ? info.timestamp : ''} ${info.level}: [${info.label}] ${info.message}`;
});

function getLogger(module) {

  const path = module.filename.split('/').slice(-2).join('/');

  return winston.createLogger({
    level: isDev ? 'debug' : 'info',
    format: combine(
      colorize(),
      label({ label: path }),
      timestamp(),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'notice'
      })
    ]
  })

}

module.exports = getLogger;
