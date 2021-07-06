const { ApolloServer } = require('apollo-server-express');
const contextMidleware = require("./context")






/**
 * Creates an Apollo server and identifies if user is authenticated or not
 *
 * @param {obj} schema GraphQL Schema
 * @param {array} resolvers GraphQL Resolvers
 * @param {obj} models Mongoose Models
 */
module.exports  = (schema, resolvers) => {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    introspection: true,
    context: contextMidleware
  });
};

