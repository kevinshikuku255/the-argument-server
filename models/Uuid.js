const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User schema
 */
const uuidSchema = new Schema(
  {
   uuid: String
  },
  {
    timestamps: true,
  }
) ;

module.exports = mongoose.model('Uuid', uuidSchema);
