const keys = require('lodash/keys');

const DebtsModel = require('../db/models/debts.model');



const getId = (msg) => msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

const getDebt = async (bot, chatId, query) => {
  if (keys(query).length > 1) {
    return await DebtsModel.findOne(query, (err) => {
      if (err) return bot.sendMessage(chatId, JSON.stringify(err));
    }).lean().exec()
  } else {
    return await DebtsModel.find(query, (err) => {
      if (err) return bot.sendMessage(chatId, JSON.stringify(err));
    }).lean().exec()
  }
};

const messageWithRemove = (bot, chatId, text, time) => {
  const t = time * 1000 || 15000;

  bot
    .sendMessage(chatId, text)
    .then((message) => setTimeout(() => bot.deleteMessage(chatId, message.message_id), t));
};


module.exports = {
  getId,
  getDebt,
  messageWithRemove
};
