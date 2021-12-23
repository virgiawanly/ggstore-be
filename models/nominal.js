const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nominalSchema = new Schema(
  {
    coinQuantity: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
      required: [true, "Nama coin harus diisi"],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Nominal = mongoose.model("Nominal", nominalSchema);
module.exports = Nominal;
