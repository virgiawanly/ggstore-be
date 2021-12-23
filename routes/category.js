const express = require("express");
const router = express.Router();
const {
  category_index,
  category_create_get,
  category_create_post,
  category_update_get,
  category_update_put,
  category_delete,
} = require("../controllers/categoryController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", category_index);
router.get("/create", category_create_get);
router.post("/", category_create_post);
router.get("/:id/edit", category_update_get);
router.put("/:id", category_update_put);
router.delete("/:id", category_delete);

module.exports = router;
