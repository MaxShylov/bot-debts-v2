const express = require('express');
const app = express();

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const userCommands = require('./commands/user.commands');
const debtCommands = require('./commands/debt.commands');
const helpCommands = require('./commands/help.commands');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

let isConnectDB = true;

mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_SECRET}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      alert(JSON.stringify(err));
      isConnectDB = false
    }
  }
);

app.get('/', (req, res) => {
  startBot();

  res.send('This is telegram bot: @BT-debts')
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Example app listening on port 3000!');
});

const startBot = () => {
  helpCommands(bot, isConnectDB);
  userCommands(bot);
  debtCommands(bot);
};

startBot();
