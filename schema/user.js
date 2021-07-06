const { gql } = require('apollo-server-express');

// The GraphQL schema
const typeDefs = gql`
type user{
   id: ID,
   username: String
    group: Boolean
    description: String
}

type userPayload{
   id: ID,
   username: String,
   messages: [Message]
    location: String
    group: Boolean
    image: String,
    coverImage: String
}

  type authUserPayload {
    username: String!
    group: Boolean
    token: String
  }

  type Query {
     getUser(username:String): userPayload
     getAuthUser: userPayload
     getUsers: [userPayload]
     _getUsers: [userPayload]
  }

type Mutation {
    signup(
        username: String!
        group: Boolean!
        description: String
     ): authUserPayload

    # Signs in user
    signin(
        username: String!
     ): authUserPayload

    # Edit user profile
     editUserProfile(
        id:ID,
        fullname: String
        location: String
        description: String
     ): authUserPayload
}

`;

module.exports = typeDefs;