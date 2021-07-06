const Message =  require("./message");
const User = require("./user");

// A map of functions which return data for the schema.
const typeDefs = {
  Query: {
     ...Message.Query,
     ...User.Query,
  },

  Mutation: {
    ...Message.Mutation,
    ...User.Mutation,
  },
Subscription: {
  ...Message.Subscription,
}
};

module.exports = typeDefs ;