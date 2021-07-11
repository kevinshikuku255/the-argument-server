const {PubSub} = require("graphql-subscriptions");
const {  LIKE_CREATED  }  = require("../constants/subscription");


const pubsub = new PubSub();

module.exports = {
       Mutation:  {
        /**
         * Creates a like for post
         * @param {string} messageId
         */
        createLike: async ( __,{ messageId }, { Like, Message }) => {

          // create and  save like to DB
          const like = await new Like({
                       message: messageId,
                       }).save();

          // Push like to message collection
         await Message.findOneAndUpdate({ _id: messageId }, { $push: { likes: like.id } });

           pubsub.publish(LIKE_CREATED, { like })

          return like;
        },
      },
     /* -------------------------------------------------------------------------- */
        Subscription :  {
           like: {
             subscribe :  () => pubsub.asyncIterator([LIKE_CREATED]),
           },
         },
}
