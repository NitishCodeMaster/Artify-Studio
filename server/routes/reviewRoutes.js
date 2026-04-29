const express = require("express");
const router = express.Router();
const { addReview, getReviews, deleteReview  } = require("../controllers/reviewController");
const { authUser } = require("../middleware/authMiddleware");

router.post("/add", authUser, addReview);
router.get("/:targetId", getReviews);
router.delete('/delete/:id', authUser, deleteReview);

module.exports = router;