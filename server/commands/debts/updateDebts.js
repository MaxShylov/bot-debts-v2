const { messageWithRemove } = require('../../helpers/common');

const config = require('../../config');
const DebtsModel = require('../../db/models/debts.model');


module.exports = async ({ bot, chatId, query, newDebt }) => {
  const message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('Database is not connect');

  return await DebtsModel.findOneAndUpdate(query, newDebt, { upsert: true }, async (err) => {
    if (err) return bot.sendMessage(chatId, 'Error: Данные не записались в базу');
  });
};
