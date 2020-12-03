const jwt = require('jsonwebtoken');

function verifyToken (token, isAccess) {
  const secret = isAccess ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  return jwt.verify(token, secret);
}

function createTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${process.env.ACCESS_TOKEN_LIFE}s`
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${process.env.REFRESH_TOKEN_LIFE}s`
  });
  return {
    accessToken,
    refreshToken
  };
}

module.exports = {
  createTokens,
  verifyToken
};
