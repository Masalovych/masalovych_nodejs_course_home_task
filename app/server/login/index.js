const db = require("../../db/models");
const { createTokens, verifyToken } = require('../helpers/tokens');
const User = db.User;

// curl 'http://localhost:3000/users' \
// --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjA2NDAyMjEyLCJleHAiOjE2MDY0MDIzMzJ9.y_UZcC2K9cRjaARLZ4EyKB8IBexANN6UC80FYXGynIY'
async function loginMiddleware(req, res, next) {
  try {
    const { authorization: accessToken } = req.headers;
    if (!accessToken) return res.status(403).json('Forbidden');

    let payload;
    try {
      payload = verifyToken(accessToken, true);
      const user = await User.findByPk(payload.id);

      if (user.accessToken !== accessToken) return res.status(401).json({error: 'Invalid token'});

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

// curl --request POST 'http://localhost:3000/refreshTokens' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjA2NDAyMjY0LCJleHAiOjE2MDY0MDIzODR9.pYIrEYbnB7xzGYrAr364HDi0Ugg7BVnms6_JBDTP1lo"
// }'
async function refreshTokens (req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(403).json('Forbidden');

    let payload;
    try {
      payload = verifyToken(refreshToken, false);
    }
    catch(e){
      return res.status(401).json({error: e.message});
    }

    let user = await User.findByPk(payload.id);

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

// curl --request POST 'http://localhost:3000/checkAccess' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjA2NDAyMDUzLCJleHAiOjE2MDY0MDI2NTN9.gDoiYYTxrUbuX8j6piRq4rZ37Rg_ExdMHMVf4qPrM4o"
// }'
async function checkAccess (req, res, next) {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(403).json('Forbidden');

    let payload;
    try {
      payload = verifyToken(accessToken, true);
    }
    catch(e){
      return res.status(401).json({error: e.message});
    }
    let user = await User.findByPk(payload.id);

    return res.status(200).json(user);
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
