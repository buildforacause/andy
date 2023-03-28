const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    aname: {
      type: String,
      required: true,
    },
    aaddress: {
      type: String,
      required: true,
    },
    aphone: {
        type: Number,
        required: true,
    }
  },
  { timestamps: true }
);

const addressModel = mongoose.model("address", addressSchema);
module.exports = addressModel;
