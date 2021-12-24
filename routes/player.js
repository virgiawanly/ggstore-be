const os = require("os");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: os.tmpdir() });
const {
  landing_page,
  detail_page,
  category,
  checkout,
  transaction_history,
  transaction_detail,
  dashboard,
  profile,
  edit_profile,
} = require("../controllers/playerController");
const { isLoginPlayer } = require("../middleware/auth");

router.get("/landing-page", landing_page);
router.get("/:id/detail", detail_page);
router.get("/category", category);
router.get("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, transaction_history);
router.get("/history/:id", isLoginPlayer, transaction_detail);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);
router.put("/profile", isLoginPlayer, upload.single("avatar"), edit_profile);

module.exports = router;
