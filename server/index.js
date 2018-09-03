const express = require('express');
const app = express();

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const userCommands = require('./commands/user.commands.js');
const debtCommands = require('./commands/debt.commands.js');
const dotenv = require('dotenv').config().parsed;

const bot = new TelegramBot(dotenv.TOKEN, { polling: true });

let isConnectDB = true;

mongoose.connect(
  `mongodb://${dotenv.USER}:${dotenv.SECRET}@ds119572.mlab.com:19572/depts_bot`,
  { useNewUrlParser: true },
  (err) => {
    if (err) isConnectDB = false
  }
);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!');
});




bot.onText(/\/start/, (msg) => {
  const chat = msg.chat.id;

  if (!isConnectDB) return bot.sendMessage(chat, 'База данных не подключенна');

  bot.sendMessage(chat, 'Будет вывод долгов каждое 11е число');

  schedule.scheduleJob({ date: 11 }, () => {
    bot.sendMessage(chat, 'тут будет вывод долгов каждое 11е число'); //TODO сделать вывод
  });
});

bot.onText(/\/db/, (msg) => {
  const chat = msg.chat.id;

  bot.sendMessage(chat, `База данных ${!isConnectDB ? 'не ' : ''}подключенна`);
});

bot.onText(/\/delete_bot/, (msg) => {
  const chat = msg.chat.id;

  bot.sendMessage(chat, 'Прощайте! :(');
  bot.leaveChat(chat);
});

userCommands(bot);
debtCommands(bot);
