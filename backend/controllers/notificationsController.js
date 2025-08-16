const { get } = require('react-scroll/modules/mixins/scroller');
const pool = require('../config/database');
const { PenToolIcon } = require('lucide-react');

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

    const client = await pool.connect();

    if (role !== "Admin") return response.status(403).json("Only admins can delete notifications");

    try {
        const query = `Delete from Notifications where notificationid = $1 returning *`;

        const values = [notificationid];

        await client.query("BEGIN");

        const result = await client.query(query, values);

        if (!result.rowCount) {
            await client.query("ROLLBACK");
            return response.status(404).json("Notification not found");
        }

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


module.exports = {
    generateNotification,
    getNotifications,
    deleteNotification,
};