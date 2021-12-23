const express = require("express");
const router = express.Router();

const {
  sign_in_get,
  sign_in_post,
  sign_out,
} = require("../controllers/userController");

router.get("/", sign_in_get);
router.post("/", sign_in_post);
router.get("/logout", sign_out);

module.exports = router;
