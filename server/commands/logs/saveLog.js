const log = require('../../libs/log')(module);
const LogsModel = require('../../db/models/logs.model');

const QUARTER = 1000 * 60 * 60 * 24 * 30 * 3; // 3 month


module.exports = async (chatId, text) => {
  LogsModel.create({ chatId, log: text }, (err) => {
    log[err ? 'error' : 'verbose'](text);
  });

  const logs = await LogsModel.find({ chatId });

  logs.map(i => new Date() - new Date(i.createAt) > QUARTER && LogsModel.findByIdAndDelete(i.id));
};
