const compact = require('lodash').compact;

const LogsModel = require('../../db/models/logs.model');
const { getId, messageWithRemove } = require('../../helpers/common');
const config = require('../../config');


module.exports = async (bot, msg) => {
  const
    chatId = getId(msg),
    count = +compact(msg.text.split(' '))[1],
    message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('База данных не подключена, попробуйте позже');

  const logs = await LogsModel.find({ chatId }).sort('-createAt').limit(count || 3);

  let answer = '========';

  for (let i = logs.length - 1; i > -1; i--) {
    answer += '\n' + logs[i].createAt.toLocaleString() + '\n' + logs[i].log + '\n========'
  }

  return message(answer, 10);
};
