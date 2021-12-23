const Payment = require("../models/payment");
const Bank = require("../models/bank");

const payment_index = async (req, res) => {
  try {
    const payment = await Payment.find().populate("banks");
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    res.render("admin/payment/index", {
      payment,
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

const payment_create_get = async (req, res) => {
  try {
    const bank = await Bank.find();
    res.render("admin/payment/create", {
      bank,
      user: req.session.user,
      title: "GGStore - Tambah Metode Pembayaran",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/payment");
  }
};

const payment_create_post = async (req, res) => {
  try {
    const { type, banks } = req.body;
    const payment = new Payment({ type, banks });
    await payment.save();
    req.flash("alertMessage", "Jenis pembayaran berhasil dibuat");
    req.flash("alertStatus", "success");
    res.redirect("/payment");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/payment");
  }
};

const payment_update_get = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ _id: id }).populate("banks");
    const bank = await Bank.find();
    res.render("admin/payment/edit", {
      payment,
      bank,
      user: req.session.user,
      title: "GGStore - Edit Metode Pembayaran",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/payment");
  }
};

const payment_update_put = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, banks } = req.body;
    await Payment.findOneAndUpdate({ _id: id }, { type, banks });
    req.flash("alertMessage", "Jenis pembayaran berhasil diupdate");
    req.flash("alertStatus", "success");
    res.redirect("/payment");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/payment");
  }
};

const payment_delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.findOneAndDelete({ _id: id });
    req.flash("alertMessage", "Jenis pembayaran berhasil dihapus");
    req.flash("alertStatus", "success");
    res.redirect("/payment");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/payment");
  }
};

module.exports = {
  payment_index,
  payment_create_get,
  payment_create_post,
  payment_update_get,
  payment_update_put,
  payment_delete,
};
