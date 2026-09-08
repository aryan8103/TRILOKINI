const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/sync', requireAuth, authController.sync);
router.get('/me', requireAuth, authController.me);
router.put('/me', requireAuth, authController.updateProfile);
router.get('/users', authController.listUsers);

module.exports = router;
