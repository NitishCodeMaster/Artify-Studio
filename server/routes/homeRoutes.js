const express = require("express");
const router = express.Router();
const { getHomeData } = require("../controllers/homeController");

router.get("/data", getHomeData);
router.get("/data", (req, res) => {
    console.log("HOME API HIT");
    res.send("working");
});

module.exports = router;