const os = require("os");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: os.tmpdir() });
const {
  voucher_index,
  voucher_create_get,
  voucher_create_post,
  voucher_update_get,
  voucher_update_put,
  voucher_delete,
  voucher_status_update,
} = require("../controllers/voucherController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", voucher_index);
router.get("/create", voucher_create_get);
router.post("/", upload.single("image"), voucher_create_post);
router.put("/status/:id", voucher_status_update);
router.get("/:id/edit", voucher_update_get);
router.put("/:id", upload.single("image"), voucher_update_put);
router.delete("/:id", voucher_delete);

module.exports = router;
