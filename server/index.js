const express = require('express');
const app = express();

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const userCommands = require('./commands/user.commands');
const debtCommands = require('./commands/debt.commands');
const helpCommands = require('./commands/help.commands');

const { TOKEN, DB_USER, DB_SECRET, DB_HOST, DB_NAME, PORT } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

let isConnectDB = true;

mongoose.connect(
  `mongodb://${DB_USER}:${DB_SECRET}@${DB_HOST}/${DB_NAME}`,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      alert(JSON.stringify(err));
      isConnectDB = false
    }
  }
);

app.get('/', (req, res) => res.send('This is telegram bot: @BT-debts'));

app.listen(PORT || 8080, () => {
  console.log('Example app listening on port 8080!');
});

const startBot = () => {
  helpCommands(bot, isConnectDB);
  userCommands(bot);
  debtCommands(bot);
};

startBot();
