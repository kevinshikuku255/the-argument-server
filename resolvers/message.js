const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const {PubSub} = require("graphql-subscriptions");
const {  MESSAGE_CREATED  }  = require("../constants/subscription");


const pubsub = new PubSub();


module.exports =   {
   Query:  {
    getMessage: async(_, { id }, { Message }) => {
        const message = await Message.findById(id)
          .populate("sender");
          return message
    },

      getGroupMessages: async(_, { receiver, limit, end  }, { Message , User}) => {
          try{
            // Validate user input
            if(!receiver || receiver.trim() === "") {
                  throw UserInputError("Provide group username")
            };

          const user = await User.findOne({ username: receiver });
            // const query = { receiver: user._id };
          const query = end ?  {  $and: [{ _id: { $gt: end } }, { receiver: user._id }], } :  { receiver: user._id }

            const count = await Message.find(query).countDocuments();
            const messages = await Message.find(query)
              .populate({
                path: "sender"
              })
              .limit(limit)
              .sort({ _id: -1 });


            let returnedMessagesLength = messages.length;
            const cursor = messages[returnedMessagesLength - 1]
            const hasmore = count > limit ? true : false;
            return( {
              messages,
              count ,
              hasmore,
              cursor: cursor._id
            })

          }catch(err){
            throw new Error(err)
          }
      }
    },

/* -------------------------------------------------------------------------- */
    Mutation:  {
    /**
       * sends a new message  to group or individual user
       * @param {string} body
       * @param {string} to
       */
      sendMessage: async ( _, {  body, receiver }, { Message, User, authUser}) => {
        try{
        // Check for auth user
        if(!authUser) throw new AuthenticationError("Unauthenticated");

      // Check for exitence of message recipient in DB
      const query = { username: receiver };
        const recipient = await User.findOne(query);
        if(!recipient){
              throw new UserInputError("User not found")
        };

        //Validate user input
        if ( body.trim() === ""  || !body) {
          throw new UserInputError('cant post a blank message.');
        };

        // create message and save to DB
        const newMessage = await new Message({
          body,
          receiver: recipient.id,
          sender: authUser.id
        }).save();

      const newMsguser = await User.findById(newMessage.sender)

      let   msg = {
          _id: newMessage._id,
          body: newMessage.body,
          sender: newMsguser.username,
          createdAt: newMessage.createdAt,
        } 

        // Publish the message creation event.
    pubsub.publish(MESSAGE_CREATED, {message: msg})

      // find a sender from model and update  message field
          await User.findOneAndUpdate(
            { _id: authUser.id },
            { $push: { messages: newMessage.id } }
          );

      // find a receiver from model and update  message field
          await User.findOneAndUpdate(
            { _id: recipient.id },
            { $push: { messages: newMessage.id } }
          );

      // Return  the created message
        return newMessage;

        }catch(err){
          throw new Error(err)
        }
      },
    },


/* -------------------------------------------------------------------------- */
   Subscription :  {
      message: {
        subscribe :  () => pubsub.asyncIterator([MESSAGE_CREATED]),
      },
    },
}

