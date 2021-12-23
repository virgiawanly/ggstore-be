const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nama pemilik harus diisi"],
    },
    bankName: {
      type: String,
      required: [true, "Nama bank harus diisi"],
    },
    noRekening: {
      type: String,
      required: [true, "Nomor rekening bank harus diisi"],
    },
  },
  {
    timestamps: true,
  }
);

const Bank = mongoose.model("Bank", bankSchema);
module.exports = Bank;
