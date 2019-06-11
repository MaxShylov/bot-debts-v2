const express = require('express');
const app = express();
const config = require('./config');

const path = require('path');

const TelegramBot = require('node-telegram-bot-api');

const connect = require('./db/connect');

const usersCommands = require('./commands/users');
const debtsCommands = require('./commands/debts');
const helpCommands = require('./commands/help');
const logsCommands = require('./commands/logs');
const inDevCommands = require('./commands/inDev.commands');

const bot = new TelegramBot(config.get('TOKEN'), { polling: true });

const wwwPath = path.join(__dirname, 'www');
app.get('/', express.static(wwwPath));

app.get('/logs', (req, res) => res.sendFile(path.join(__dirname, '../combined.log')));


app.listen(config.get('PORT'), () => {
  console.log(`Example app listening on port ${config.get('PORT')}!`);
});

connect();

const startBot = () => {
  helpCommands(bot);
  logsCommands(bot);
  usersCommands(bot);
  debtsCommands(bot);
};

const startBotInDev = () => {
  inDevCommands(bot);
};


if (process.env.NODE_ENV === 'development') {
  startBotInDev()
} else {
  startBot();
}
