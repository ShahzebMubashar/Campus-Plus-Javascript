const router = require('express').Router();
const { jwtAuthMiddleware, requireAdmin } = require('../middlewares/jwtAuthMiddleware');

const { generateNotification, getNotifications, deleteNotification, readNotifications } = require('../controllers/notificationsController');

router.post('/generate', jwtAuthMiddleware, requireAdmin, generateNotification);
router.get('/', jwtAuthMiddleware, getNotifications);
router.delete('/delete/:notificationid', jwtAuthMiddleware, deleteNotification);
router.post('/mark-read', readNotifications);

module.exports = router;