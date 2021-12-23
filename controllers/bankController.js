const Bank = require("../models/bank");

const bank_index = async (req, res) => {
  try {
    const bank = await Bank.find();
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    res.render("admin/bank/index", {
      bank,
      alert,
      user: req.session.user,
      title: "GGStore - Bank",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

const bank_create_get = async (req, res) => {
  try {
    res.render("admin/bank/create", {
      user: req.session.user,
      title: "GGStore - Tambah Bank",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const bank_create_post = async (req, res) => {
  try {
    const { name, bankName, noRekening } = req.body;
    const bank = new Bank({ name, bankName, noRekening });
    await bank.save();
    req.flash("alertMessage", "Bank berhasil dibuat");
    req.flash("alertStatus", "success");
    res.redirect("/bank");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const bank_update_get = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await Bank.findOne({ _id: id });
    res.render("admin/bank/edit", {
      bank,
      user: req.session.user,
      title: "GGStore - Edit Bank",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const bank_update_put = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bankName, noRekening } = req.body;
    await Bank.findOneAndUpdate({ _id: id }, { name, bankName, noRekening });
    req.flash("alertMessage", "Bank berhasil diupdate");
    req.flash("alertStatus", "success");
    res.redirect("/bank");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const bank_delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Bank.findOneAndDelete({ _id: id });
    req.flash("alertMessage", "Bank berhasil dihapus");
    req.flash("alertStatus", "success");
    res.redirect("/bank");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

module.exports = {
  bank_index,
  bank_create_get,
  bank_create_post,
  bank_update_get,
  bank_update_put,
  bank_delete,
};
