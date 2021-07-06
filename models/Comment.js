const  mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Post and user schemas
 */
const commentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;