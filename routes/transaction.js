const express = require("express");
const router = express.Router();
const {
  transaction_index,
  transaction_status_update,
} = require("../controllers/transactionController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", transaction_index);
router.put("/status/:id", transaction_status_update);

module.exports = router;
