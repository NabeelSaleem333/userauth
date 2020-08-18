const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const codeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    optcode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OptCode = mongoose.model('optcode', codeSchema);
module.exports = OptCode;