const Voucher = require("../models/voucher");
const Category = require("../models/category");
const Nominal = require("../models/nominal");
const Payment = require("../models/payment");
const Bank = require("../models/bank");
const Transaction = require("../models/transaction");
const Player = require("../models/player");
const path = require("path");
const fs = require("fs");
const config = require("../config/index");

const landing_page = async (req, res) => {
  try {
    const voucher = await Voucher.find()
      .select("_id name status category thumbnail")
      .populate("category");
    res.status(200).json({ data: voucher });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

const detail_page = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findOne({ _id: id })
      .populate("category")
      .populate("user", "_id name phoneNumber")
      .populate("nominals");
    const payment = await Payment.find().populate("banks");

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({
      data: {
        detail: voucher,
        payments: payment,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const category = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ data: category });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const checkout = async (req, res) => {
  try {
    const { userAccount, name, nominal, voucher, payment, bank } = req.body;
    const res_voucher = await Voucher.findOne({ _id: voucher })
      .select("_id name category thumbnail user")
      .populate("category user");

    if (!res_voucher)
      return res.status(404).json({ message: "Voucher tidak valid" });

    const res_nominal = await Nominal.findOne({ _id: nominal });
    if (!res_nominal)
      return res.status(404).json({ message: "Nominal tidak valid" });

    const res_payment = await Payment.findOne({ _id: payment });
    if (!res_payment)
      return res.status(404).json({ message: "Nominal tidak valid" });

    const res_bank = await Bank.findOne({ _id: bank });
    if (!res_bank)
      return res.status(404).json({ message: "Nominal tidak valid" });

    const tax = (10 / 100) * res_nominal._doc.price;
    const value = res_nominal._doc.price + tax;

    const payload = {
      voucherTopupHistory: {
        gameName: res_voucher._doc.name,
        category: res_voucher._doc.category
          ? res_voucher._doc.category.name
          : "",
        thumbnail: res_voucher._doc.thumbnail,
        coinName: res_nominal._doc.coinName,
        coinQuantity: res_nominal._doc.coinQuantity,
        price: res_nominal._doc.price,
      },
      paymentHistory: {
        name: res_bank._doc.name,
        type: res_payment._doc.type,
        bankName: res_bank._doc.bankName,
        noRekening: res_bank._doc.noRekening,
      },
      name: name,
      userAccount: userAccount,
      tax: tax,
      value: value,
      player: req.player._id,
      userHistory: {
        name: res_voucher._doc.user?.name,
        phoneNumber: res_voucher._doc.user?.phoneNumber,
      },
      category: res_voucher._doc.category?._id,
      user: res_voucher._doc.user?._id,
    };

    const transaction = new Transaction(payload);
    await transaction.save();
    res.status(201).json({
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const transaction_history = async (req, res) => {
  try {
    const { status = "" } = req.query;
    let filter = {};

    if (status.length) {
      filter = {
        ...filter,
        status: { $regex: status, $options: "i" },
      };
    }

    if (req.player._id) {
      filter = {
        ...filter,
        player: req.player._id,
      };
    }

    const history = await Transaction.find(filter);
    let total = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          value: { $sum: "$value" },
        },
      },
    ]);
    res.status(200).json({
      data: history,
      total: total.length ? total[0].value : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const transaction_detail = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id });

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    res.status(200).json({ data: transaction });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const dashboard = async (req, res) => {
  try {
    const counts = await Transaction.aggregate([
      {
        $match: { player: req.player._id },
      },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$value" },
        },
      },
    ]);

    const category = await Category.find({});

    category.forEach((ct) => {
      counts.forEach((cnt) => {
        if (cnt._id.toString() === ct._id.toString()) {
          cnt.name = ct.name;
        }
      });
    });

    const history = await Transaction.find({ player: req.player._id })
      .populate("category")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      data: history,
      counts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const profile = async (req, res) => {
  try {
    const player = {
      id: req.player._id,
      name: req.player.name,
      username: req.player.username,
      email: req.player.email,
      phone_number: req.player.phoneNumber,
      avatar: req.player.avatar,
    };
    res.status(200).json({
      data: player,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const edit_profile = async (req, res, netx) => {
  try {
    const { name = "", phoneNumber = "" } = req.body;
    const payload = {};

    if (name.length) payload.name = name;
    if (phoneNumber.length) payload.phoneNumber = phoneNumber;

    if (req.file) {
      // Get file info
      const tmp_path = req.file.path;
      const oriname = req.file.originalname;
      const file_ext = oriname.split(".")[oriname.split(".").length - 1];
      const filename = req.file.filename + "." + file_ext;
      const target_path = path.resolve(
        config.rootPath,
        `public/uploads/${filename}`
      );
      // Move file
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        // Remove current image
        let player = await Player.findOne({ _id: req.player.id });
        const current_image = `${config.rootPath}/public/uploads/${player.avatar}`;
        if (fs.existsSync(current_image)) fs.unlinkSync(current_image);
        // Store data
        player = await Player.findOneAndUpdate(
          {
            _id: req.player.id,
          },
          {
            ...payload,
            avatar: filename,
          },
          { new: true, runValidators: true }
        );
        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      });
      src.on("err", async () => {
        next(err);
      });
    } else {
      const player = await Player.findOneAndUpdate(
        { _id: req.player._id },
        payload,
        { new: true, runValidators: true }
      );
      res.status(201).json({
        data: {
          id: player.id,
          name: player.name,
          phoneNumber: player.phoneNumber,
          avatar: player.avatar,
        },
      });
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.status(422).json({
        error: true,
        message: err.message,
        fields: err.errors,
      });
    }
  }
};

module.exports = {
  landing_page,
  detail_page,
  category,
  checkout,
  transaction_history,
  transaction_detail,
  dashboard,
  profile,
  edit_profile,
};
