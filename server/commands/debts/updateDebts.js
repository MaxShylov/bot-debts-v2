const { messageWithRemove } = require('../../helpers/common');

const config = require('../../config');
const log = require('../../libs/log')(module);
const DebtsModel = require('../../db/models/debts.model');
const LogsModel = require('../../db/models/logs.model');

const QUARTER = 1000 * 60 * 60 * 24 * 30 * 3; // 3 month


module.exports = async ({ bot, chatId, query, newDebt, successText, type }) => {
  const message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('Database is not connect');

  await DebtsModel.findOneAndUpdate(query, newDebt, { upsert: true }, async (err) => {
    const
      text = err ? 'Error: Данные не записались в базу' : successText,
      logs = await LogsModel.find({ chatId });

    logs.map(async i => {
      if (new Date() - new Date(i.createAt) > QUARTER) await LogsModel.findByIdAndDelete(i.id)
    });

    LogsModel.create({ chatId, log: text });

    log.verbose(text);

    if (type === 'dellAll') return bot.sendMessage(chatId, text);

    return message(text);

  });
};
