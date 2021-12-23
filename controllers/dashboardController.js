const Category = require("../models/category");
const Player = require("../models/player");
const Transaction = require("../models/transaction");
const Voucher = require("../models/voucher");

const index = async (req, res) => {
  try {
    const transaction = await Transaction.countDocuments();
    const voucher = await Voucher.countDocuments();
    const category = await Category.countDocuments();
    const player = await Player.countDocuments();
    res.render("admin/dashboard/index", {
      user: req.session.user,
      title: "GGStore - Dashboard",
      count: {
        transaction,
        voucher,
        player,
        category,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
};
