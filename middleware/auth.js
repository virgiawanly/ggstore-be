const config = require("../config/index");
const jwt = require("jsonwebtoken");
const Player = require("../models/player");

const isLoginAdmin = (req, res, next) => {
  if (req.session.user === null || req.session.user === undefined) {
    res.redirect("/");
  } else {
    next();
  }
};

const isLoginPlayer = async (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.replace("Bearer ", "")
      : null;
    const data = jwt.verify(token, config.jwtKey);
    const player = await Player.findOne({ _id: data.player.id });

    if (!player) {
      throw new Error();
    }

    req.player = player;
    req.token = token;

    next();
  } catch (err) {
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};

module.exports = {
  isLoginAdmin,
  isLoginPlayer,
};
