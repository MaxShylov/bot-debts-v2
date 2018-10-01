const { getDebt, getId } = require('../helpers/common');

const compact = require('lodash').compact;
const isEmpty = require('lodash').isEmpty;

const DebtsModel = require('../models/debts.model');


module.exports = (bot) => {

  // ADD_USER
  bot.onText(/\/add_user ([^;'\"]+)/, async (msg, match) => {
    const
      chatId = getId(msg),
      user = compact(match[1].split(' ')),
      name = user[0],
      login = user[1].includes('@') ? compact(user[1].split('@'))[0] : user[1],
      userWithLogin = await getDebt(bot, chatId, { login, chatId }),
      userWithName = await getDebt(bot, chatId, { name, chatId }),
      textError = (type) => `Пользователь с таким ${type === 'login' ? 'логином' : 'именем'} уже существует.`;

    if (!isEmpty(userWithLogin)) return bot.sendMessage(chatId, textError('login'));
    if (!isEmpty(userWithName)) return bot.sendMessage(chatId, textError('name'));

    DebtsModel.create({
      chatId,
      name,
      login,
      debts: {},
      total: 0
    }, (err) => {
      if (err) return bot.sendMessage(chatId, JSON.stringify(err));
    });


    bot.sendMessage(chatId, `Пользователь ${name} создан!`);
  });


  bot.onText(/\/list_users/, async (msg, match) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    let users = await DebtsModel.find({ chatId: chat }, (err) => {
      if (err) return bot.sendMessage(chat, JSON.stringify(err));
    });


    if (isEmpty(users)) return bot.sendMessage(chat, 'Пользователи еще не созданы.');

    let textUsers = 'Пользователи: \n';

    users.map(i => textUsers += `${i.name} - @${i.login}\n`);

    bot.sendMessage(chat, textUsers);
  });

  bot.onText(/\/remove_user/, async (msg, match) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    bot.sendMessage(chat, 'Команда еще не готова');
  })
};
