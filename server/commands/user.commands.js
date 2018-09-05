const compact = require('lodash').compact;
const isEmpty = require('lodash').isEmpty;
const escapeRegExp = require('lodash').escapeRegExp;

const DebtsModel = require('../models/debts.model');


module.exports = (bot) => {
  bot.onText(/\/add_user ([^;'\"]+)/, async (msg, match) => {
    const
      chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id,
      user = compact(match[1].split(' ')),
      name = user[0],
      login = user[1].includes('@') ? compact(user[1].split('@'))[0] : user[1];

    const
      userWithLogin = await DebtsModel
        .find({
          login: { $regex: escapeRegExp(login), $options: 'i' },
          chatId: chat
        })
        .lean()
        .exec(),
      userWithName = await DebtsModel
        .find({
          name: { $regex: escapeRegExp(name), $options: 'i' },
          chatId: chat
        })
        .lean()
        .exec();

    if (!isEmpty(userWithLogin)) return bot.sendMessage(chat, 'Пользователь с таким логином уже существует.');
    if (!isEmpty(userWithName)) return bot.sendMessage(chat, 'Пользователь с таким именем уже существует.');

    DebtsModel.create({
      chatId: chat,
      name,
      login,
      debts: {},
      total: 0
    });


    bot.sendMessage(chat, `Пользователь ${name} создан!`);
  });

  bot.onText(/\/list_users/, async (msg, match) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    let users = await DebtsModel.find({ chatId: chat }).lean().exec();

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
