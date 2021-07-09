const { gql } = require( 'apollo-server-express');
const message = require("./message");
const user = require("./user");





const schema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

${message}
${user}

`;
module.exports =  schema;



module.exports = gql`
#/* -------------------------------------------------------------------------- */
# custom types
type message{
   _id: ID,
   body: String!
   sender: String
   receiver: String
   createdAt: String
}
type messagePayload{
   id: ID,
   body: String!,
   sender: User
   receiver: User
   createdAt: String
}

type User{
   id: ID,
   username: String
   image:String
   coverImage: String
    group: Boolean
    description: String
}

type userPayload{
   id: ID,
    username: String,
    description: String,
    messages: [messagePayload]
    location: String,
    manager:String,
    owner: String,
    founded: String,
    stadium: String,
    founder: String,
    group: Boolean
    image: String,
    coverImage: String
}

  type authUserPayload {
    username: String!
    group: Boolean
    token: String
  }


type messageConnection {
  cursor: String
  count: String
  hasmore:Boolean
  messages: [messagePayload]

}


#/* -------------------------------------------------------------------------- */
#Query types
  type Query {
     getMessage(id:ID): messagePayload,
     getGroupMessages(receiver: String!, limit: Int, end: String): messageConnection
     getUser(username:String): userPayload
     getAuthUser: userPayload
     getGroups:[userPayload]
     getUsers: [userPayload]
  }


#/* -------------------------------------------------------------------------- */
#Mutation types
  type Mutation {
    sendMessage(body: String!  receiver: String): message



    # Signs up new user only  accesible by admin
    signup(
        username: String!
        group: Boolean!
        manager: String
        stadium: String
        owner: String
        founded: String
        founder: String
        description: String
        image: String
        coverImage: String
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


#/* -------------------------------------------------------------------------- */
  type Subscription {
     message: message
  }
`;
