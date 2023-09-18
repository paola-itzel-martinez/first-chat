const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");
const { User } = require("../models");

const INVALID_LOGIN_TOKEN = {
  code: 404,
  user: null,
};

const createJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.LOGIN_TOKEN_KEY,
      {
        expiresIn: "24h",
      },
      (error, token) => {
        if (error) {
          reject("Without access");
        } else {
          resolve(token);
        }
      },
    );
  });
};

const validateLoginToken = async (token) => {
  try {
    if (isEmpty(token)) return INVALID_LOGIN_TOKEN;

    const { uid } = jwt.verify(token, process.env.LOGIN_TOKEN_KEY);

    if (isEmpty(uid)) return INVALID_LOGIN_TOKEN;

    const user = await User.findOne({ _id: uid, status: true });

    if (isEmpty(user)) return INVALID_LOGIN_TOKEN;

    return { code: 200, user };
  } catch (error) {
    return INVALID_LOGIN_TOKEN;
  }
};

module.exports = {
  createJWT,
  validateLoginToken,
};
