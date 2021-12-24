const Transaction = require("../models/transaction");

const transaction_index = async (req, res) => {
  try {
    const transaction = await Transaction.find().populate("player");
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    res.render("admin/transaction/index", {
      transaction,
      alert,
      user: req.session.user,
      title: "GGStore - Metode Pembayaran",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

const transaction_status_update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const transaction = await Transaction.findOne({ _id: id });
    if (transaction.status !== "pending") {
      throw new Error("Gagal update status");
      return;
    }
    transaction.status = status;
    await transaction.save();
    req.flash("alertMessage", "Status transaksi berhasil diupdate");
    req.flash("alertStatus", "success");
    res.redirect("/transaction");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/transaction");
  }
};

module.exports = {
  transaction_index,
  transaction_status_update,
};
