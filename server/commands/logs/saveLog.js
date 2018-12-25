const log = require('../../libs/log')(module);
const LogsModel = require('../../db/models/logs.model');

const QUARTER = 1000 * 60 * 60 * 24 * 30 * 3; // 3 month


module.exports = async (chatId, text) => {
  if (!chatId && !text) return log.error('chatId or text is empty');

  text = text.replace(/<[^](.*?)>/g, '');

  const logs = await LogsModel.find({ chatId }).sort('-createAt');

  if (text.includes('_______') && text === logs[0].log) {

    LogsModel.findById(logs[0].id, (err, doc) => {
      if (err) return log.error(err);

      doc.updateAt = new Date().toISOString();
      doc.save();
    });

    return
  }

  LogsModel.create({ chatId, log: text }, (err) => {
    log[err ? 'error' : 'verbose'](text);
  });

  logs.map(i => new Date() - new Date(i.createAt) > QUARTER && LogsModel.findByIdAndDelete(i.id));
};
