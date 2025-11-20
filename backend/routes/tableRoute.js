const express = require("express");
const {
  addTable,
  getTables,
  updateTable,
  updateTableStatus,
  deleteTable,
} = require("../controllers/tableController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

router.route("/").post(isVerifiedUser, addTable);
router.route("/").get(isVerifiedUser, getTables);
router.route("/update-status").put(isVerifiedUser, updateTableStatus);
router.route("/:id").put(isVerifiedUser, updateTable);
router.route("/:id").delete(isVerifiedUser, deleteTable);
module.exports = router;
