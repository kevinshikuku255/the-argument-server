const  jwt_decode = require("jwt-decode");
const {  AuthenticationError, PubSub } = require('apollo-server-express');
const models = require("../models");

const pubsub = new PubSub()

/**
 * Checks if client is authenticated by checking authorization key from req headers
 * @param {obj} token
 */

const checkAuthorization = (token) => {
  let authUser;
  try{
   if(token){
     const decodedToken = jwt_decode(token)
     authUser = decodedToken
   }
  }catch(err){
   throw new AuthenticationError(err)
  }

  return authUser
}

module.exports =  ({ req, connection }) => {

      if (connection) {
        return connection.context;
      }

      let authUser;
      if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization;
        const user =   checkAuthorization(token);
        if (user) {
            authUser = user; 
        }
      }

      return Object.assign({authUser }, {pubsub}, models);
    }