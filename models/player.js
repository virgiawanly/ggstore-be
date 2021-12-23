const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: [3, "Panjang minimal 3 karakter"],
    },
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      maxlength: [225, "Panjang karakter harus antara 3 - 225"],
      minlength: [3, "Panjang karakter harus antara 3 - 225"],
    },
    username: {
      type: String,
      required: [true, "Username harus diisi"],
      maxlength: [225, "Panjang karakter harus antara 3 - 225"],
      minlength: [3, "Panjang karakter harus antara 3 - 225"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Nomor telepon harus diisi"],
    },
    avatar: {
      type: String,
    },
    banks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
