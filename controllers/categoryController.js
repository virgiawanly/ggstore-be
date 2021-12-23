const Category = require("../models/category");

const category_index = async (req, res) => {
  try {
    const category = await Category.find();
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    res.render("admin/category/index", {
      category,
      alert,
      user: req.session.user,
      title: "GGStore - Kategori",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const category_create_get = async (req, res) => {
  try {
    res.render("admin/category/create", {
      user: req.session.user,
      title: "GGStore - Tambah Kategori",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const category_create_post = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name: name });
    await category.save();
    req.flash("alertMessage", "Kategori berhasil dibuat");
    req.flash("alertStatus", "success");
    res.redirect("/category");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const category_update_get = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });
    res.render("admin/category/edit", {
      category,
      user: req.session.user,
      title: "GGStore - Edit Kategori",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const category_update_put = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await Category.findOneAndUpdate({ _id: id }, { name: name });
    req.flash("alertMessage", "Kategori berhasil diupdate");
    req.flash("alertStatus", "success");
    res.redirect("/category");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const category_delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findOneAndDelete({ _id: id });
    req.flash("alertMessage", "Kategori berhasil dihapus");
    req.flash("alertStatus", "success");
    res.redirect("/category");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

module.exports = {
  category_index,
  category_create_get,
  category_create_post,
  category_update_get,
  category_update_put,
  category_delete,
};
