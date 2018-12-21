const isEmpty = require('lodash/isEmpty');
const isInteger = require('lodash/isInteger');
const keys = require('lodash/keys');
const compact = require('lodash/compact');

const updateDebts = require('./updateDebts');
const { getId, getDebt, messageWithRemove } = require('../../helpers/common');
const config = require('../../config');


const checkErrors = (from, to, sum) => {
  let error = null;

  if (!config.get('dbConnected')) error = 'Database is not connect';

  if (!from || !to || !sum) error = 'Команда введена неверно!';
  if (!from.includes('@') || !to.includes('@')) error = 'ЛОГИН должен содержать симлов "@"!';
  if (!isInteger(sum)) error = 'Ведите коректную сумму!';

  return error
};

module.exports = async (type, bot, msg) => {
  const
    chatId = getId(msg),
    userI = ['@i', '@I', '@me', 'Me', '@ME'],
    fixUser = (login) => userI.includes(login) ? '@' + msg.from.username : login,
    m = compact(msg.text.split(' ')),
    isAdd = type === 'add',
    message = (text, t) => messageWithRemove(bot, chatId, text, t || 5);

  let
    from = fixUser(m[1]),
    to = fixUser(m[2]),
    sum = +m[3];

  const error = checkErrors(from, to, sum);
  if (error) message(error);

  from = from.slice(1);
  to = to.slice(1);
  sum = +[isAdd ? sum : -sum];

  const
    isFrom = await getDebt(chatId, { chatId, login: from }),
    isTo = await getDebt(chatId, { chatId, login: to });

  if (isEmpty(isFrom) || isEmpty(isTo)) return message(`@${isEmpty(isTo) ? to : from} в базе не найден!`);

  const
    query = { chatId, login: from },
    debt = await getDebt(bot, chatId, query),
    newDebt = {
      ...debt,
      total: +debt.total + sum,
      debts: {
        ...debt.debts,
        [to]: debt.debts && debt.debts[to] ? +debt.debts[to] + sum : sum
      }
    },
    successText = `@${from} ${isAdd ? 'должен' : 'отдал'} @${to} ${Math.abs(sum)}грн.`;

  keys(newDebt.debts).map(i => {
    if (+newDebt.debts[i] === 0) delete newDebt.debts[i]
  });

  await updateDebts({ bot, chatId, query, newDebt, successText });
};
