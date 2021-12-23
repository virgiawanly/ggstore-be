const express = require("express");
const router = express.Router();
const { index } = require("../controllers/dashboardController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", index);

module.exports = router;
