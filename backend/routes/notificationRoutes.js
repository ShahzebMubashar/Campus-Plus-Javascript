const router = require('express').Router();
const { jwtAuthMiddleware, requireAdmin } = require('../middlewares/jwtAuthMiddleware');

const {
    generateNotification,
    getNotifications,
    deleteNotification,
    readNotifications,
    getNotificationCount,
} = require('../controllers/notificationsController');

router.post('/generate', jwtAuthMiddleware, requireAdmin, generateNotification);
router.get('/', jwtAuthMiddleware, getNotifications);
router.delete('/delete/:notificationid', jwtAuthMiddleware, deleteNotification);
router.post('/mark-read', jwtAuthMiddleware, readNotifications);
router.get('/count', jwtAuthMiddleware, getNotificationCount);

module.exports = router;