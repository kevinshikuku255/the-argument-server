const mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

/**
 * Message schema that has references to User  and Comment schemas
 */
const messageSchema = Schema(
  {
    body: String,
    image: String,
    imagePublicId: String,
    to: String,
    from: String,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver:{
      type: Schema.Types.ObjectId,
      ref:"User"
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);

// const messageModel  =  mongoose.model('Message', messageSchema);
// module.exports = messageModel;