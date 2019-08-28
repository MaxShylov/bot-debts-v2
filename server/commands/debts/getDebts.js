const petrovich = require('petrovich');
const isEmpty = require('lodash/isEmpty');
const findKey = require('lodash/findKey');
const keys = require('lodash/keys');
const compact = require('lodash/compact');


const { getId, messageWithRemove, getDebt } = require('../../helpers/common');
const config = require('../../config');
const saveLog = require('../logs/saveLog');

const SPACE = '\b\b\b\b\b\b\b';


module.exports = async (bot, msg) => {
  const
    HR = '_______',
    chatId = getId(msg),
    sec = +compact(msg.text.split(' '))[1],
    message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('База данных не подключена, попробуйте позже');

  const debts = await getDebt(bot, chatId, { chatId });

  if (!debts || isEmpty(debts)) return 'Нет пользователей';

  let str = HR;

  for (let i = 0; i < debts.length; i++) {
    const d = debts[i];

    if (d.debts && keys(d.debts).length && !!findKey(d.debts, (v) => v)) {
      str += `\n<b>${d.name} должен</b>: <i>(${d.total}</i>)\n`;

      for (let j = 0; j < keys(d.debts).length; j++) {
        const
          key = keys(d.debts)[j],
          name = debts.filter(x => x.login === key)[0].name;

        if (d.debts[key]) str += `${SPACE} > ${petrovich.male.first.dative(name)}: ${d.debts[key]}\n`
      }
    } else {
      str += `\n<b>${d.name}</b>: Нет долгов\n`
    }

    str += HR
  }

  saveLog(chatId, str);

  return message(str, sec || 180);
};
