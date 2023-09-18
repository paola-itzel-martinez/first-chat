const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");
const { User } = require("../models");
const { setResponseError, validateLoginToken } = require("../helpers");

const AUTH_ERROR = {
  code: 401,
  error: "Validation failed",
};

const validateToken = async (request, response, next) => {
  const token = request.header("Authorization");

  if (!token) return setResponseError({ response, ...AUTH_ERROR });

  try {
    const { user } = await validateLoginToken(token);

    if (isEmpty(user)) return setResponseError({ response, ...AUTH_ERROR });

    request.user = user;

    next();
  } catch (error) {
    setResponseError({
      response,
      error,
    });
  }
};

module.exports = {
  validateToken,
};
