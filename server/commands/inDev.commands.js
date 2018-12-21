const { getId } = require('../helpers/common');

const addUser = require('./users/addUser');
const listUsers = require('./users/listUsers');

const getDebts = require('./debts/getDebts');
const addOrDel = require('./debts/addOrDel');
const delAll = require('./debts/delAll');

const DEV_CHAT_ID = 276399001;


module.exports = (bot) => {

  bot.onText(/\/*/, async (msg) => {
    const chatId = getId(msg);

    if (chatId === DEV_CHAT_ID) {
      if (msg.text.includes('/add_user')) return await addUser(bot, msg);
      if (msg.text.includes('/list_users')) return await listUsers(bot, msg);

      if (msg.text.includes('/get_debts')) return await getDebts(bot, msg);
      if (msg.text.includes('/add ')) return await addOrDel('add', bot, msg);
      if (msg.text.includes('/del ')) return await addOrDel('del', bot, msg);
      if (msg.text.includes('/del_all')) return await delAll(bot, msg)
    }

    return bot
      .sendMessage(chatId, 'The bot in develop mode')
      .then((message) => setTimeout(() => bot.deleteMessage(chatId, message.message_id), 3000));
  });

};
