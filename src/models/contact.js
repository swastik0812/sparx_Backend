const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
const contact = mongoose.model("contact", contactSchema);

module.exports = contact;
