/* eslint-disable no-useless-escape */
const makeRegExp = (name, shortName) => {
  const cmdWithProps = `^\/${name} ([^;'\"]+)`;
  const cmd = `^\/${name}$`;
  const cmdShortWithProps = `^\/${shortName} ([^;'\"]+)`;
  const cmdShort = `^\/${shortName}$`;
  const cmdWithBot = `^\/${name}@MoneyDebts_bot$`;

  return new RegExp(
    [cmdWithProps, cmdShortWithProps, cmd, cmdShort, cmdWithBot].join('|'),
  );
};

module.exports = {
  // Debts commands
  /**
   * Add debt
   * /add debtor creditor amount [comment]
   */
  add: makeRegExp('add', 'a'),
  /**
   * Delete debt
   * /del debtor creditor amount
   */
  del: makeRegExp('del', 'd'),
  /**
   * Get all debts
   * /get_debts [time]
   */
  getDebts: makeRegExp('getdebts', 'gd'),
  /**
   * Get debts with filter by myself
   * /get_my_debts [time]
   */
  getMyDebts: makeRegExp('getmydebts', 'gm'),

  // Debts History commands
  /**
   * Get debts history
   * /get_debts_history
   * /TODO add filters [amount|date] [time]
   */
  getDebtsHistory: makeRegExp('getdebtshistory', 'gdh'),

  // Users commands
  /**
   * Add user
   * /add_user name username
   */
  addUser: makeRegExp('adduser', 'au'),
  /**
   * Add user
   * /add_user name username
   */
  getUserId: makeRegExp('getuserid', 'gui'),
  /**
   * Update user
   * /update_user
   */
  updateUser: makeRegExp('updateuser', 'uu'),
  /**
   * Get all user
   * /get_users [time]
   */
  getUsers: makeRegExp('getusers', 'gu'),

  // Logs commands
  /**
   * Get all logs
   * /get_logs [amount] [time]
   * /TODO add [amount|date] for filter by data
   */
  getLogs: makeRegExp('getlogs', 'gl'),
};

// get_chat_id;
// get_settings;
// set_settings;
