const DebtsModel = require('../db/models/debts.model');


const getId = (msg) => msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

const getDebt = async (bot, chatId, query) => {
  await DebtsModel.findOne(query, (err) => {
    if (err) return bot.sendMessage(chatId, JSON.stringify(err));
  }).lean().exec()
};


module.exports = {
  getId,
  getDebt
};
