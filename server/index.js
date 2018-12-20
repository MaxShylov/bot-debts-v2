const express = require('express');
const app = express();
const config = require('./config');

const TelegramBot = require('node-telegram-bot-api');

const connect = require('./db/connect');

const userCommands = require('./commands/user.commands');
const debtCommands = require('./commands/debt.commands');
const helpCommands = require('./commands/help.commands');
const inDevCommands = require('./commands/inDev.commands');

const bot = new TelegramBot(config.get('TOKEN'), { polling: true });

app.get('/', (req, res) => res.send('This is telegram bot: @BT-debts'));


app.listen(config.get('PORT'), () => {
  console.log(`Example app listening on port ${config.get('PORT')}!`);
});

connect();

const startBot = () => {
  helpCommands(bot);
  userCommands(bot);
  debtCommands(bot);
};

const startBotInDev = () => {
  inDevCommands(bot);
};


if (process.env.NODE_ENV === 'development') {
  startBotInDev()
} else {
  startBot();
}
