const { getId } = require('../helpers/common');


module.exports = (bot) => {

  bot.onText(/\/*/, (msg) => {
    const chatId = getId(msg);

    console.log('msg', msg);

    return bot
      .sendMessage(chatId, 'The bot in develop mode')
      .then((message) => setTimeout(() => bot.deleteMessage(chatId, message.message_id), 3000));
  });

};
