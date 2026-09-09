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
router.route("/").post(isVerifiedUser, addTable).get(isVerifiedUser, getTables);

router
  .route("/:id")
  .put(isVerifiedUser, updateTable)
  .delete(isVerifiedUser, deleteTable);

router.route("/:id/status").patch(isVerifiedUser, updateTableStatus);

module.exports = router;
