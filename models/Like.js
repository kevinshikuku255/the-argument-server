const mongoose = require( 'mongoose');

const Schema = mongoose.Schema;

/**
 * Like schema that has references to Post and User schema
 */
const likeSchema = Schema(
  {
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Like', likeSchema);
