const os = require("os");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

const { sign_up, sign_in } = require("../controllers/authController");

router.post("/sign-up", upload.single("image"), sign_up);
router.post("/sign-in", sign_in);

module.exports = router;
