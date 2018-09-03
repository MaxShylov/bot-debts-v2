const express = require('express');
const app = express();

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const userCommands = require('./commands/user.commands.js');
const debtCommands = require('./commands/debt.commands.js');
// const dotenv = require('dotenv').config().parsed;

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

let isConnectDB = true;

mongoose.connect(
  `mongodb://${process.env.USER}:${process.env.SECRET}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  { useNewUrlParser: true },
  (err) => {
    if (err) isConnectDB = false
  }
);

app.get('/', function (req, res) {
  res.send('This is telegram bot');
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!');
});


bot.onText(/\/start/, (msg) => {
  const chat = msg.chat.id;

  if (!isConnectDB) return bot.sendMessage(chat, 'База данных не подключенна');

  bot.sendMessage(chat, 'Будет вывод долгов каждое 11е число');

  schedule.scheduleJob({ date: 11 }, () => {
    bot.sendMessage(chat, 'тут будет вывод долгов каждое 11е число');
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
