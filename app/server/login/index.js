const db = require("../../db/models");
const { createTokens, verifyToken } = require('../helpers/tokens');
const User = db.User;

// curl 'http://localhost:3000/users' \
// --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjA2NDA0NzE3LCJleHAiOjE2MDY0MDQ4Mzd9.XhXp9lZ8s-VOOVxKF4D4IXfYbJTJSSL7FpqSZcJBPag'
async function loginMiddleware(req, res, next) {
  try {
    const { authorization: accessToken } = req.headers;
    if (!accessToken) return res.status(403).json('Forbidden');

    let payload;
    try {
      payload = verifyToken(accessToken, true);
      const user = await User.findByPk(payload.id);

      if (user.accessToken !== accessToken) return res.status(401).json({error: 'Old token'});

      res.user = user;
      next();
    }
    catch(e){
      return res.status(401).json({error: e.message});
    }
  } catch (err) {
    next(err);
  }
}

// curl --request POST 'http://localhost:3000/login' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "login": "BabaraLevy@gmail.com",
//    "password": "Bond"
// }'
async function login (req, res, next) {
  try {
    const {login , password } = req.body;

    const user = await User.findOne({
      where: { email: login }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { accessToken, refreshToken } = createTokens({ id: user.id });

    await user.update({accessToken, refreshToken});

    return res.status(200).json({
      id: user.id,
      login: user.email,
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
}

// curl 'http://localhost:3000/refreshTokens' \
// --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjA2NDA0Njg3LCJleHAiOjE2MDY0MDUyODd9.a1XoXEtx2OmcKYEm-Sn06t-Eb79Prx9FUbm0vtexX-g'

async function refreshTokens (req, res, next) {
  try {
    const { authorization: refreshToken } = req.headers;
    if (!refreshToken) return res.status(403).json('Forbidden');

    let payload;
    try {
      payload = verifyToken(refreshToken, false);
    }
    catch(e){
      return res.status(401).json({error: e.message});
    }

    let user = await User.findByPk(payload.id);

    if (user.refreshToken !== refreshToken) return res.status(401).json({error: 'Old token'});

    const { accessToken, refreshToken: newRefreshToken } = createTokens({ id: user.id });

    await user.update({accessToken, refreshToken: newRefreshToken});

    return res.status(200).json({
      id: user.id,
      login: user.email,
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
}

// curl 'http://localhost:3000/checkAccess' \
// --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjA2NDA0Njg3LCJleHAiOjE2MDY0MDQ4MDd9.2KYvx2vwbeEWdGsCTdhZZDSdnyDaP6rhCnh6oSRy7cc'
async function checkAccess (req, res, next) {
  try {
    return res.status(200).json(res.user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  loginMiddleware,
  refreshTokens,
  checkAccess,
};
