const { getId, getDebt } = require('../../helpers/common');


module.exports = async (bot, msg) => {
  const
    chatId = getId(msg),
    users = await getDebt(bot, chatId, { chatId });

  let text = `\n${msg.text.replace('/channel', '').replace(/\s+/g, ' ')}`;

  if (!text.replace(' ', '')) return;

  for (let i = users.length - 1; i >= 0; i--) {
    text = `@${users[i].login} ` + text
  }

  bot.sendMessage(chatId, text);
};
