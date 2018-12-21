const petrovich = require('petrovich');
const isEmpty = require('lodash/isEmpty');
const findKey = require('lodash/findKey');
const keys = require('lodash/keys');


const { getId, messageWithRemove, getDebt } = require('../../helpers/common');
const config = require('../../config');


module.exports = async (bot, msg) => {
  const
    chatId = getId(msg),
    message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('Database is not connect');

  const debts = await getDebt(bot, chatId, { chatId });

  if (!debts || isEmpty(debts)) return 'Нет пользователей';

  let str = '_______';

  for (let i = 0; i < debts.length; i++) {
    const d = debts[i];

    if (d.debts && keys(d.debts).length && !!findKey(d.debts, (v) => v)) {
      str += '\n' + d.name + ': ' + d.total + '\n';

      for (let j = 0; j < keys(d.debts).length; j++) {
        const
          key = keys(d.debts)[j],
          name = debts.filter(x => x.login === key)[0].name;

        if (d.debts[key]) str += `\b\b\b\b\b\b\b > ${petrovich.male.first.dative(name)}: ${d.debts[key]}\n`
      }
    } else {
      str += `\n${d.name}: Нет долгов\n`
    }

    str += '_______'
  }

  return message(str, 180);
};
