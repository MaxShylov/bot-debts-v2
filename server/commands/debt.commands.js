const isEmpty = require('lodash').isEmpty;
const findKey = require('lodash').findKey;
const isInteger = require('lodash').isInteger;
const keys = require('lodash').keys;
const compact = require('lodash').compact;

const DebtsModel = require('../models/debts.model');
const { getId } = require( '../helpers/common');

module.exports = (bot) => {

  // Remove Message
  const removeMessage = (msg, time) => {
    const
      chatId = getId(msg),
      t = time * 1000 || 15000;

    return setTimeout(() => bot.deleteMessage(chatId, msg.message_id), t)
  };

  // Get Debt
  const getDebt = async (chatId, query) => {
    await DebtsModel.findOne(query, (err) => {
      if (err) return bot.sendMessage(chatId, JSON.stringify(err));
    }).lean().exec()
  };

  // Get Debts
  const getDebts = async (chatId) => {
    const debts = await getDebt(chatId, { chatId });

    if (!debts || isEmpty(debts)) return 'Нет пользователей';

    let str = '_______';

    debts.map(i => {
      if (i.debts && keys(i.debts).length && !!findKey(i.debts, (v) => v)) {
        str += '\n' + i.name + ': ' + i.total + '\n';

        keys(i.debts).map(j => {
          const name = debts.filter(x => x.login === j)[0].name;

          if (i.debts[j]) str += `\b\b\b\b\b\b\b > ${name}: ${i.debts[j]}'\n`
        })
      } else {
        str += `\n${i.name}: Нет долгов\n`
      }

      str += '_______'
    });

    return str;
  };


  // Update Debts
  const updateDebts = (chatId, query, newDebt, successText, cb) => {
    DebtsModel.findOneAndUpdate(query, newDebt, { upsert: true }, (err) => {
      const text = err ? 'Error: Данные не записались в базу' : successText;

      if (cb) return cb();

      return bot
        .sendMessage(chatId, text)
        .then(removeMessage);
    });
  };

  // GET DEBTS
  bot.onText(/\/get_debts/, async (msg) => {
    const
      chatId = getId(msg),
      str = await getDebts(chatId);

    return bot
      .sendMessage(chatId, str)
      .then((message) => removeMessage(message, 45));
  });


  // ADD / DEL
  bot.onText(/\/add (.+)/, async (msg, match) => await shortEntry('add', msg, match));
  bot.onText(/\/del (.+)/, async (msg, match) => await shortEntry('del', msg, match));
  bot.onText(/\/add@bt_debts_bot (.+)/, async (msg, match) => await shortEntry('add', msg, match));
  bot.onText(/\/del@bt_debts_bot (.+)/, async (msg, match) => await shortEntry('del', msg, match));

  const shortEntry = async (type, msg, match) => {
    const
      chatId = getId(msg),
      userI = ['@i', '@I', '@me', 'Me', '@ME'],
      fixUser = (login) => userI.includes(login) ? '@' + msg.from.username : login,
      m = compact(match[1].split(' ')),
      isAdd = type === 'add';

    let
      from = fixUser(m[0]),
      to = fixUser(m[1]),
      sum = +m[2],
      errorText = '';

    if (!from || !to || !sum) errorText = 'Команда введена неверно!';
    if (!from.includes('@') || !to.includes('@')) errorText = 'ЛОГИН должен содержать симлов "@"!';
    if (!isInteger(sum)) errorText = 'Ведите коректную сумму!';

    if (errorText) return bot.sendMessage(chatId, errorText);

    from = from.slice(1);
    to = to.slice(1);
    sum = +[isAdd ? sum : -sum];

    const
      isFrom = await getDebt(chatId, { chatId, login: from }),
      isTo = await getDebt(chatId, { chatId, login: to });

    if (isEmpty(isFrom) || isEmpty(isTo)) {
      return bot.sendMessage(chatId, `@${isEmpty(isTo) ? to : from} в базе не найден!`);
    }

    const
      query = { chatId, login: from },
      debt = await getDebt(chatId, query),
      newDebt = {
        ...debt,
        total: +debt.total + sum,
        debts: {
          ...debt.debts,
          [to]: debt.debts && debt.debts[to] ? +debt.debts[to] + sum : sum
        }
      },
      successText = `@${from} ${isAdd ? 'должен' : 'отдал'} @${to} ${Math.abs(sum)}грн.`;

    updateDebts(chatId, query, newDebt, successText);
  };


  // DEL_ALL
  bot.onText(/\/del_all/, async (msg) => {
    const
      chatId = getId(msg),
      login = msg.from.username,
      query = { login, chatId },
      debt = await getDebt(chatId, query),
      newDebt = {
        ...debt,
        total: 0,
        debts: {}
      };

    if (!debt) return bot
      .sendMessage(chatId, `Пользователь ${login} не найден`)
      .then(removeMessage);

    let successText = '';

    keys(debt.debts).map(i => {
      successText += `@${login} отдал @${i} ${Math.abs(debt.debts[i])}грн.\n`;
    });

    updateDebts(chatId, query, newDebt, successText);
  });

};
