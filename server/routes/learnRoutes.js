const express = require('express');
const router = express.Router();
const learnController = require('../controllers/learnController');
const { authUser } = require('../middleware/authMiddleware');

router.get('/overview', learnController.getLearnOverview);
router.get('/mentors', learnController.getMentors);
router.get('/workshops', learnController.getWorkshops);
router.post('/workshops', authUser, learnController.createWorkshop);
router.post('/seed', authUser, learnController.seedLearnData);

module.exports = router;
