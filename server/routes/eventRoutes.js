const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authUser } = require('../middleware/authMiddleware');

router.get('/get-all', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

router.post('/create', authUser, eventController.createEvent);

router.post('/:id/review', authUser, eventController.addEventReview);

router.delete('/delete/:id', authUser, eventController.deleteEvent);

module.exports = router;