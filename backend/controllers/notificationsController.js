const { FaTruck } = require('react-icons/fa');
const pool = require('../config/database');

const generateNotification = async (request, response) => {
    const { user: { userid, role }, body: { notification, title } } = request;

    // if (role !== "Admin") return response.status(403).json("Only admins can generate notifications");

    if (!notification || !title) return response.status(400).json("Notification and title are required");

    const client = await pool.connect();

    try {
        const query = `Insert into Notifications (title, notification, posted_at) values ($1, $2, now()) returning *`;

        const values = [title, notification];

        await client.query("BEGIN");

        const result = await client.query(query, values);

        if (!result.rowCount) {
            await client.query("ROLLBACK");
            return response.status(500).json("Failed to create notification");
        }

        const updateNotificationCount = await client.query(`Update NotificationCount set notification_count = notification_count + 1`);

        if (!updateNotificationCount.rowCount) {
            await client.query("ROLLBACK");
            return response.status(500).json("Failed to update notification count");
        }

        await client.query("COMMIT");

        return response.status(201).json("Notification created successfully");
    } catch (error) {
        console.error("Error generating notification:", error);
        await client.query("ROLLBACK");
        return response.status(500).json("Internal server error");
    } finally {
        client.release();
    }
}

const getNotifications = async (request, response) => {
    try {
        const query = `Select * from Notifications order by posted_at desc`;

        const res = await pool.query(query);

        if (!res.rowCount) return response.status(200).json("No notifications found");

        return response.status(200).json(res.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return response.status(500).json("Internal server error");
    }
}

const deleteNotification = async (request, response) => {
    const { params: { notificationid }, user: { role } } = request;
    console.log("\n\n\nDeleting notification with ID:", notificationid);

    if (!notificationid) return response.status(400).json("Notification ID is required");

    const client = await pool.connect().then(console.log("Connected to database for deleting notification"));

    if (role !== "Admin") return response.status(403).json("Only admins can delete notifications");
    console.log("Admin role confirmed for deleting notification");
    try {
        const query = `Delete from Notifications where notificationid = $1 returning *`;

        const values = [notificationid];

        await client.query("BEGIN");

        const result = await client.query(query, values);

        if (!result.rowCount) {
            await client.query("ROLLBACK");
            console.log("Notification not found for deletion");
            return response.status(404).json("Notification not found");
        }

        console.log("Notification deleted successfully:", result.rows[0]);
        await client.query("COMMIT");

        return response.status(200).json("Notification deleted successfully");
    } catch (error) {
        console.error("Error deleting notification:", error);
        await client.query("ROLLBACK");
        return response.status(500).json("Internal server error");
    } finally {
        client.release();
    }
}

const readNotifications = async (request, response) => {
    const { body: { userid } } = request;

    console.log("\n\n\nMarking notifications as read for user ID:", userid);

    if (!userid) return response.status(400).json("User ID is required");

    const client = await pool.connect();

    try {
        const query = `Update NotificationCount set notification_count = 0 where userid = $1 returning *`;
        const values = [userid];

        await client.query("BEGIN");

        const result = await client.query(query, values);

        if (!result.rowCount) {
            await client.query("ROLLBACK");
            return response.status(404).json("No notifications to mark as read");
        }

        await client.query("COMMIT");

        return response.status(200).json("Notifications marked as read");
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return response.status(500).json("Internal server error");
    } finally {
        client.release();
    }
}

module.exports = {
    generateNotification,
    getNotifications,
    deleteNotification,
    readNotifications
};