const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User schema
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,
    manager:String,
    owner: String,
    founded: String,
    stadium: String,
    founder: String,
    image: String,
    coverImage: String,
    group: Boolean,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
) ;

module.exports = mongoose.model('User', userSchema);

// const userModel = mongoose.model('User', userSchema);
// module.exports = userModel;