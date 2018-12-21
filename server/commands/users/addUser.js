const compact = require('lodash').compact;
const isEmpty = require('lodash').isEmpty;

const { getDebt, getId, messageWithRemove } = require('../../helpers/common');
const DebtsModel = require('../../db/models/debts.model');
const config = require('../../config');


module.exports = async (bot, msg) => {
  const
    chatId = getId(msg),
    user = compact(msg.text.split(' ')),
    name = user[1],
    login = user[2].includes('@') ? compact(user[2].split('@'))[0] : user[2],
    message = (text) => messageWithRemove(bot, chatId, text, 3);

  if (!config.get('dbConnected')) return message('Database is not connect');

  const
    userWithLogin = await getDebt(bot, chatId, { login, chatId }),
    userWithName = await getDebt(bot, chatId, { name, chatId }),
    textError = (type) => `Пользователь с таким ${type === 'login' ? 'логином' : 'именем'} уже существует.`;

  if (!name || !login) return message('Имя или логин введены не верно');
  if (!isEmpty(userWithLogin)) return message(textError('login'));
  if (!isEmpty(userWithName)) return message(textError('name'));

  DebtsModel.create({
    chatId,
    name,
    login,
    debts: {},
    total: 0
  }, (err) => {
    if (err) return bot.sendMessage(chatId, JSON.stringify(err));
  });

  return message(`Пользователь ${name} создан!`)
};
