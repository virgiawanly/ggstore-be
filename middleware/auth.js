const isLoginAdmin = (req, res, next) => {
  if (req.session.user === null || req.session.user === undefined) {
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = {
  isLoginAdmin,
};
