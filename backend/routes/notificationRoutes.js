const router = require('express').Router();
const { jwtAuthMiddleware, requireAdmin } = require('../middlewares/jwtAuthMiddleware');

const { generateNotification, getNotifications } = require('../controllers/notificationsController');

router.post('/generate', jwtAuthMiddleware, requireAdmin, generateNotification);
router.get('/', jwtAuthMiddleware, getNotifications);

module.exports = router;