const { gql } = require( 'apollo-server-express');



module.exports = gql`
#/* -------------------------------------------------------------------------- */
# custom types
type message{
   id:ID
   body: String!
   sender: String
   receiver: String
   createdAt: String
}
type likePayload{
   id:ID
   message: message
   createdAt:String
}

 type like{
    id:ID
   message: String
   createdAt: String
 }

type messagePayload{
   id: ID,
   body: String!,
   sender: User
   receiver: String
   likes: [like]
   createdAt: String
}

type User{
   id: ID
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
    createLike(messageId: String): like



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
        username: String! uuid: String
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
     like: like
  }
`;
