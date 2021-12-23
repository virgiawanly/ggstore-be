const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    voucher: {
      type: Schema.Types.ObjectId,
      ref: "Voucher",
    },
    voucherTopupHistory: {
      gameName: {
        type: String,
        required: [true, "Nama game harus diisi"],
      },
      category: {
        type: String,
        required: [true, "Kategori harus diisi"],
      },
      thumbnail: {
        type: String,
      },
      coinName: {
        type: String,
        required: [true, "Nama koin harus diisi"],
      },
      coinQuantity: {
        type: String,
        required: [true, "Jumlah koin harus diisi"],
      },
      price: {
        type: Number,
      },
    },
    paymentHistory: {
      name: {
        type: String,
        required: [true, "Nama harus diisi"],
      },
      type: {
        type: String,
        required: [true, "Tipe pembayaran harus diisi"],
      },
      bankName: {
        type: String,
        required: [true, "Nama bank harus diisi"],
      },
      noRekening: {
        type: String,
        required: [true, "Nomor rekening harus diisi"],
      },
    },
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      maxlength: [225, "Panjang karakter harus antara 3 - 225"],
      minlength: [3, "Panjang karakter harus antara 3 - 225"],
    },
    userAccount: {
      type: String,
      required: [true, "Nama akun harus diisi"],
      maxlength: [225, "Panjang karakter harus antara 3 - 225"],
      minlength: [3, "Panjang karakter harus antara 3 - 225"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
    userHistory: {
      name: {
        type: String,
        required: [true, "Nama user harus diisi"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Nomor telepon harus diisi"],
        maxlength: [225, "Nomor telepon harus antara 9 - 13"],
        minlength: [9, "Nomor telepon harus antara 9 - 13"],
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
