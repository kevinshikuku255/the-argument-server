const { gql } = require('apollo-server-express');

// The GraphQL schema
module.exports = gql`


# custom types
type Message{
   id: ID,
   body: String!
   to: String
}
type messagePayload{
   id: ID,
   body: String!,
   from: String,
   to: String
   createdAt: String
}

type Query {
     getMessage(id:ID): messagePayload,
     getMessages(from: String!): [messagePayload]!
     getGroupMessages(to: String!): [messagePayload]
}

  type Mutation {
    sendMessage(body: String!  to: String): Message
  }

  type Subscription {
     newMessage: messagePayload
  }
`;
