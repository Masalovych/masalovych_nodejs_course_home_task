const DEFAULT_NODE_PORT = 3000;
const DEFAULT_ENV = 'development';

const availableArgs = parseNodeArgs(process.argv);

function parseNodeArgs(nodeArgs) {
  const requiredArgLength = 2;
  const argsArr = nodeArgs.slice(requiredArgLength);
  const argRegExp = /^-(\w+)=(\w+)/;

  return argsArr.reduce((acc, item) => {
    if(argRegExp.test(item)) {
      const matches = item.match(argRegExp)
      acc[matches[1]] = matches[2];
    }
    return acc;
  }, {});
}

module.exports = {
  PORT: process.env.NODE_PORT || DEFAULT_NODE_PORT,
  ENV: availableArgs.env || DEFAULT_ENV
};
