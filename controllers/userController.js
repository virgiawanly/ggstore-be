const User = require("../models/user");
const bcrypt = require("bcryptjs");

const sign_in_get = async (req, res) => {
  try {
    const alert = {
      message: req.flash("alertMessage"),
      status: req.flash("alertStatus"),
    };
    if (req.session.user === null || req.session.user === undefined) {
      res.render("admin/users/sign_in", {
        alert,
      });
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

const sign_in_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status === "Y") {
        req.session.user = {
          id: user._id,
          email: user.email,
          status: user.status,
          name: user.name,
          phoneNumber: user.phoneNumber,
        };
        res.redirect("/dashboard");
      } else {
        throw new Error("Email atau password salah");
      }
    } else {
      throw new Error("Email atau password salah");
    }
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

const sign_out = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/dashboard");
  }
};

module.exports = {
  sign_in_get,
  sign_in_post,
  sign_out,
};
