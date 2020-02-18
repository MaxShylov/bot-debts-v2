const { getId } = require('../../helpers/common');

module.exports = (bot, msg) => {
  const chatId = getId(msg);

  bot.sendMessage(chatId, `Chat Id: ${chatId}`);
};
