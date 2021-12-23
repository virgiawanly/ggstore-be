const Nominal = require("../models/nominal");

const nominal_index = async (req, res) => {
  try {
    const nominal = await Nominal.find();
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    res.render("admin/nominal/index", {
      nominal,
      alert,
      user: req.session.user,
      title: "GGStore - Nominal",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/nominal");
  }
};

const nominal_create_get = async (req, res) => {
  try {
    res.render("admin/nominal/create", {
      user: req.session.user,
      title: "GGStore - Tambah Nominal",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/nominal");
  }
};

const nominal_create_post = async (req, res) => {
  try {
    const { coinName, coinQuantity, price } = req.body;
    const nominal = new Nominal({ coinName, coinQuantity, price });
    await nominal.save();
    req.flash("alertMessage", "Nominal berhasil dibuat");
    req.flash("alertStatus", "success");
    res.redirect("/nominal");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/nominal");
  }
};

const nominal_update_get = async (req, res) => {
  try {
    const { id } = req.params;
    const nominal = await Nominal.findOne({ _id: id });
    res.render("admin/nominal/edit", {
      nominal,
      user: req.session.user,
      title: "GGStore - Edit Nominal",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/nominal");
  }
};

const nominal_update_put = async (req, res) => {
  try {
    const { id } = req.params;
    const { coinName, coinQuantity, price } = req.body;
    await Nominal.findOneAndUpdate(
      { _id: id },
      { coinName, coinQuantity, price }
    );
    req.flash("alertMessage", "Nominal berhasil diupdate");
    req.flash("alertStatus", "success");
    res.redirect("/nominal");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/nominal");
  }
};

const nominal_delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Nominal.findOneAndDelete({ _id: id });
    req.flash("alertMessage", "Nominal berhasil dihapus");
    req.flash("alertStatus", "success");
    res.redirect("/nominal");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/nominal");
  }
};

module.exports = {
  nominal_index,
  nominal_create_get,
  nominal_create_post,
  nominal_update_get,
  nominal_update_put,
  nominal_delete,
};
