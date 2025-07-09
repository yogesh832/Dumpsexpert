const express = require("express");
const router = express.Router();

const {
  getMenuBuilder,
  updateMenuBuilder,
  addMenuItem
} = require("../controllers/menuBuilderController");

router.get("/", getMenuBuilder);            // GET menu
router.put("/", updateMenuBuilder);         // PUT full update
router.post("/add", addMenuItem);           // POST single item to main/premade

module.exports = router;
