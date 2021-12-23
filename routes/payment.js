const express = require("express");
const router = express.Router();
const {
  payment_index,
  payment_create_get,
  payment_create_post,
  payment_update_get,
  payment_update_put,
  payment_delete,
} = require("../controllers/paymentController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", payment_index);
router.get("/create", payment_create_get);
router.post("/", payment_create_post);
router.get("/:id/edit", payment_update_get);
router.put("/:id", payment_update_put);
router.delete("/:id", payment_delete);

module.exports = router;
