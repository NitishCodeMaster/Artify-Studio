const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authUser } = require('../middleware/authMiddleware');

router.get('/get-all', eventController.getAllEvents);
router.get('/nearby', eventController.getNearbyEvents);
router.get('/:id', eventController.getEventById);

router.post('/create', authUser, eventController.createEvent);
router.post('/:id/review', authUser, eventController.addEventReview);

router.delete('/delete/:id', authUser, eventController.deleteEvent);

router.post('/:id/apply', authUser, eventController.applyForGig);
router.post('/:id/select-applicant', authUser, eventController.selectGigApplicant);

router.post('/:id/generate-ticket', authUser, eventController.generateEventTicket);
router.get('/:id/my-ticket', authUser, eventController.getMyEventTicket);
router.post('/verify-ticket', authUser, eventController.verifyTicketEntry);

// Register multiple update route aliases to ensure zero 404 errors
router.put('/update/:id', authUser, eventController.updateEvent);
router.post('/update/:id', authUser, eventController.updateEvent);
router.put('/:id', authUser, eventController.updateEvent);

module.exports = router;