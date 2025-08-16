const router = require('express').Router();
const { jwtAuthMiddleware, requireAdmin } = require('../middlewares/jwtAuthMiddleware');

const { generateNotification } = require('../controllers/notificationsController');

router.post('/generate', jwtAuthMiddleware, requireAdmin, generateNotification);

module.exports = router;