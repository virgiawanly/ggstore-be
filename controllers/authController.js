const Player = require("../models/player");
const path = require("path");
const fs = require("fs");
const config = require("../config/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sign_up = async (req, res, next) => {
  try {
    const payload = req.body;
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
        // Store data
        try {
          const player = new Player({
            ...payload,
            avatar: filename,
          });
          await player.save();
          delete player._doc.password;
          res.status(201).json({ data: player });
        } catch (err) {
          if (err.name === "ValidationError") {
            return res
              .status(422)
              .json({ error: true, message: err.message, fields: err.errors });
          }
          next(err);
        }
      });
    } else {
      const player = new Player(payload);
      await player.save();
      delete player._doc.password;
      res.status(201).json({ data: player });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(422)
        .json({ error: true, message: err.message, fields: err.errors });
    }
    next(err);
  }
};

const sign_in = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  Player.findOne({ email: email })
    .then((player) => {
      if (player && bcrypt.compareSync(password, player.password)) {
        const token = jwt.sign(
          {
            player: {
              id: player.id,
              username: player.username,
              email: player.email,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          },
          config.jwtKey
        );
        res.status(200).json({
          data: {
            token,
          },
        });
      } else {
        res.status(403).json("Email atau password salah");
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || "Internal server error" });
      next();
    });
};

module.exports = {
  sign_up,
  sign_in,
};
