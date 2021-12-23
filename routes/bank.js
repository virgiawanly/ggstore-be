const express = require("express");
const router = express.Router();
const {
  bank_index,
  bank_create_get,
  bank_create_post,
  bank_update_get,
  bank_update_put,
  bank_delete,
} = require("../controllers/bankController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", bank_index);
router.get("/create", bank_create_get);
router.post("/", bank_create_post);
router.get("/:id/edit", bank_update_get);
router.put("/:id", bank_update_put);
router.delete("/:id", bank_delete);

module.exports = router;
