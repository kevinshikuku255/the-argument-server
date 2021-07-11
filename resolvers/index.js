const Message =  require("./message");
const User = require("./user");
const Like = require("./like");

// A map of functions which return data for the schema.
const typeDefs = {
  Query: {
     ...Message.Query,
     ...User.Query,
  },

  Mutation: {
    ...Message.Mutation,
    ...User.Mutation,
    ...Like.Mutation
  },
Subscription: {
  ...Message.Subscription,
  ...Like.Subscription
}
};

module.exports = typeDefs ;