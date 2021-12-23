const Category = require("../models/category");
const Voucher = require("../models/voucher");
const Nominal = require("../models/nominal");
const path = require("path");
const fs = require("fs");
const config = require("../config/index");

const voucher_index = async (req, res) => {
  try {
    const voucher = await Voucher.find()
      .populate("category")
      .populate("nominals");
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    res.render("admin/voucher/index", {
      voucher,
      alert,
      user: req.session.user,
      title: "GGStore - Voucher",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

const voucher_create_get = async (req, res) => {
  try {
    const category = await Category.find();
    const nominal = await Nominal.find();
    res.render("admin/voucher/create", {
      category: category,
      nominal: nominal,
      user: req.session.user,
      title: "GGStore - Tambah Voucher",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

const voucher_create_post = async (req, res) => {
  try {
    const { name, category, nominals } = req.body;
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
        try {
          // Store data
          const voucher = new Voucher({
            name,
            category,
            nominals,
            thumbnail: filename,
          });
          await voucher.save();
        } catch (err) {
          throw err.message;
        }
      });
    } else {
      // Store data
      const voucher = new Voucher({
        name,
        category,
        nominals,
      });
      await voucher.save();
    }
    req.flash("alertMessage", "Voucher berhasil dibuat");
    req.flash("alertStatus", "success");
    res.redirect("/voucher");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

const voucher_update_get = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id })
      .populate("category")
      .populate("nominals");
    const category = await Category.find();
    const nominal = await Nominal.find();
    res.render("admin/voucher/edit", {
      voucher,
      category,
      nominal,
      user: req.session.user,
      title: "GGStore - Edit Voucher",
    });
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

const voucher_update_put = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, nominals } = req.body;
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
        try {
          // Remove current image
          const voucher = await Voucher.findOne({ _id: id });
          const current_image = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
          if (fs.existsSync(current_image)) fs.unlinkSync(current_image);
          // Store data
          await Voucher.findOneAndUpdate(
            {
              _id: id,
            },
            {
              name,
              category,
              nominals,
              thumbnail: filename,
            }
          );
        } catch (err) {
          throw err.message;
        }
      });
    } else {
      // Store data
      await Voucher.findOneAndUpdate(
        {
          _id: id,
        },
        {
          name,
          category,
          nominals,
        }
      );
    }
    req.flash("alertMessage", "Voucher berhasil dibuat");
    req.flash("alertStatus", "success");
    res.redirect("/voucher");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

const voucher_delete = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id });

    const current_image = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
    if (fs.existsSync(current_image)) fs.unlinkSync(current_image);

    await Voucher.findOneAndDelete({ _id: id });
    req.flash("alertMessage", "Voucher berhasil dihapus");
    req.flash("alertStatus", "success");
    res.redirect("/voucher");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

const voucher_status_update = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id });
    const new_status = voucher.status === "Y" ? "N" : "Y";
    await Voucher.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: new_status,
      }
    );
    req.flash("alertMessage", "Status voucher berhasil diupdate");
    req.flash("alertStatus", "success");
    res.redirect("/voucher");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/voucher");
  }
};

module.exports = {
  voucher_index,
  voucher_create_get,
  voucher_create_post,
  voucher_update_get,
  voucher_update_put,
  voucher_delete,
  voucher_status_update,
};
