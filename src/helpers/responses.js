const moment = require('moment');
const isEmpty = require('lodash/isEmpty');

const { SPACE, CURRENCY } = require('../utils/constants');

const makeMsgLogs = logs => {
  if (isEmpty(logs)) return 'Log is empty';

  const parsedLogs = logs.map(log => {
    const date = `<b>Date:</b> ${moment(log.updatedAt).format('lll')}`;
    const request = `<b>Request:</b> ${log.request}`;
    const status = `<b>Status:</b> ${log.status}`;
    const message = `<b>Message:</b> "${log.message}"`;
    const response = `<b>Response:</b>\n  ${status}\n  ${message}`;

    return `${date}\n${request}\n${response}`;
  });

  return `<b>Logs:</b>\n\n${parsedLogs.join('\n\n')}`;
};

const makeMsgAllUsers = users => {
  if (isEmpty(users)) return 'Users are not found';

  const parsedUsers = users.map(
    user => `<b>${user.name}</b> - ${user.username}`,
  );

  return `<b>Users:</b>\n<i>(name - username)</i>\n${parsedUsers.join('\n')}`;
};

const makeMsgDebtsHistory = history => {
  if (isEmpty(history)) return 'History is empty';

  const parsedHistory = history.map(item => {
    const date = `<i>${moment(item.updatedAt).format('lll')}</i>`;
    const type = item.type;
    const debtor = item.debtor.name;
    const creditor = item.creditor.name;
    const sum = item.sum;
    const comment = item.comment ? `<i>(${item.comment})</i>` : '';
    return `${date}\n<b>${type}</b> ${debtor} ${creditor} ${sum} ${comment}`;
  });

  return `<b>Debts History:</b>\n\n${parsedHistory.join('\n\n')}`;
};

/**
 * @param {string} debtor - username of debtor
 * @param {string} creditor - username of creditor
 * @param {number} oldCreditsSum
 * @param {number} paidSum
 * @param {number} debtSum
 * @param {string} [comment]
 * @return {string}
 */
const makeMsgAddDebts = ({
  debtorUsername: debtor,
  creditorUsername: creditor,
  oldCreditsSum,
  paidSum,
  debtSum,
  comment,
}) => {
  const commentText = comment ? `<i>(${comment})</i>` : '';
  let msgOldCredits = '';
  let msgPaid = '';
  let msgOwe = '';

  if (oldCreditsSum) {
    msgOldCredits =
      `As @${creditor} owes @${debtor} ` + CURRENCY + oldCreditsSum + '\n';
  }

  if (paidSum) {
    msgPaid =
      `@${creditor} paid @${debtor} ` +
      `${CURRENCY}${paidSum} ${debtSum ? '\n' : ''}`;
  }

  if (debtSum) {
    msgOwe =
      `@${debtor} owes @${creditor} ` + CURRENCY + debtSum + ` ${commentText}`;
  }

  return msgOldCredits + msgPaid + msgOwe;
};

/**
 * @param {string} debtor - username of debtor
 * @param {string} creditor - username of creditor
 * @param {number} paidSum
 * @param {number} debtSum
 * @return {string}
 */
const makeMsgDelDebts = ({
  debtorUsername: debtor,
  creditorUsername: creditor,
  paidSum,
  debtSum,
}) => {
  const msgPaid = `@${debtor} paid @${creditor} ${CURRENCY}${paidSum}`;
  let msgOwe = '';
  if (debtSum) msgOwe = `\n@${creditor} owes @${debtor} ${CURRENCY}${debtSum}`;

  return msgPaid + msgOwe;
};

const makeMsgGetDebts = (data, isDetail) => {
  if (isEmpty(data)) return 'Debts is empty';

  return (
    '<b>My Debts:</b>\n\n' +
    data
      .map(item => {
        const debtor = `<b>${item.debtor}:</b>`;
        const total = `<i>(${item.total})</i>`;
        const strOfDebts = item.debts.map(debt => {
          let history = '';
          if (isDetail && debt.debts) {
            history =
              '\n' +
              debt.debts
                .map(item => {
                  const date = `<i>(${moment(item.createdAt).format(
                    'MM/DD hh:mm',
                  )})</i>`;
                  const debt = ` ${item.debt}`;
                  const paid = item.paid ? ` - ${item.paid}` : '';
                  const comment = item.comment && ` (${item.comment})`;
                  return SPACE.repeat(2) + date + debt + paid + comment;
                })
                .join('\n');
          }

          return `${SPACE}> ${debt.creditor}: ${debt.sum} ${history}`;
        });
        return `${debtor} ${total}\n${strOfDebts.join('\n')}`;
      })
      .join('\n\n')
  );
};

module.exports = {
  makeMsgAllUsers,
  makeMsgLogs,
  makeMsgDebtsHistory,
  makeMsgAddDebts,
  makeMsgDelDebts,
  makeMsgGetDebts,
};
