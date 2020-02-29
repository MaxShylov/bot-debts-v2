const queries = require('./queries');

const makePropString = name => {
  const field = queries[name];
  if (!field) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`Error: Query ${name} is not found`);
      // eslint-disable-next-line no-console
      console.error(`Error: Query ${name} is not found`);
    }
    return '???';
  }

  const { label, isRequired } = field;
  return isRequired ? label : `[${label}]`;
};

const makeExampleString = (command, props) => {
  const arrProps = [];

  props.forEach(item => {
    if (typeof item === 'string') {
      arrProps.push(makePropString(item));
    } else {
      item.forEach(item => arrProps.push(makePropString(item)));
    }
  });

  return `${command} ${arrProps.join(' ')}`;
};

const propsAddUser = ['name', 'username'];
const propsGetUserId = ['oldUsername'];
const propsUpdateUser = ['userId', 'newName', 'newUsername'];
const propsAdd = ['debtorUsername', 'creditorUsername', 'debtSum', 'comment'];
const propsDel = ['debtorUsername', 'creditorUsername', 'debtSum'];

module.exports = {
  /**
   * User examples
   */
  // addUser
  '/adduser': makeExampleString('/adduser', propsAddUser),
  '/au': makeExampleString('/au', propsAddUser),
  // getUserId
  '/getuserid': makeExampleString('/getuserid', propsGetUserId),
  '/gui': makeExampleString('/gui', propsGetUserId),
  // updateUser
  '/updateuser': makeExampleString('/updateuser', propsUpdateUser),
  '/uu': makeExampleString('/uu', propsUpdateUser),

  /**
   * Debts examples
   */
  // add
  '/add': makeExampleString('/add', propsAdd),
  '/a': makeExampleString('/a', propsAdd),
  // del
  '/del': makeExampleString('/del', propsDel),
  '/d': makeExampleString('/d', propsDel),
};
