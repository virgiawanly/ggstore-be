const express = require("express");
const router = express.Router();
const {
  nominal_index,
  nominal_create_get,
  nominal_create_post,
  nominal_update_get,
  nominal_update_put,
  nominal_delete,
} = require("../controllers/nominalController");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", nominal_index);
router.get("/create", nominal_create_get);
router.post("/", nominal_create_post);
router.get("/:id/edit", nominal_update_get);
router.put("/:id", nominal_update_put);
router.delete("/:id", nominal_delete);

module.exports = router;
