const  jwt = require('jsonwebtoken');

/**
 * Generates a token for user
 *
 * @param {object} user
 * @param {string} secret
 * @param {date} expiresIn
 */
const  generateToken = async (user, secret, expiresIn) => {
  const { id,  username } = user;
 const token =    jwt.sign({ id, username }, secret, { expiresIn});
  return (token)
};

module.exports = generateToken;