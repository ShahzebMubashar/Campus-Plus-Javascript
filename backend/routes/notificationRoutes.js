const router = require('express').Router();
const { jwtAuthMiddleware, requireAdmin } = require('../middlewares/jwtAuthMiddleware');

const { generateNotification, getNotifications, deleteNotification } = require('../controllers/notificationsController');

router.post('/generate', jwtAuthMiddleware, requireAdmin, generateNotification);
router.get('/', jwtAuthMiddleware, getNotifications);
router.delete('/delete/:notificationid', jwtAuthMiddleware, deleteNotification);

module.exports = router;