const pool = require('../config/database');

const generateNotification = async (request, response) => {
    const { user: { userid }, body: { notification, title } } = request;

    if (!notification || !title) return response.status(400).json("Notification and title are required");

    const client = await pool.connect();

    try {
        const query = `Insert into Notifications (title, notification, posted_at) values ($1, $2, now()) returning *`;

        const values = [title, notification];

        await client.query("BEGIN");

        const result = await client.query(query, values);

        if (!result.rowCount) return response.status(500).json("Failed to create notification");

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


module.exports = {
    generateNotification,
};