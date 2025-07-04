const pool = require('../config/database');

const batchMailer = async (request, response) => {
    try {
        const emails = await pool.query(`SELECT email FROM Users`);

        if (!emails.rowCount) {
            console.log("No registered Users found");
            return response?.status?.(400)?.json?.("No registered Users found");
        }

        const emailList = emails.rows.map(user => user.email);

        console.log(`Fetched ${emails.rowCount} email(s):`);
        emailList.forEach(email => console.log(email));

        return response?.status?.(200)?.json?.({
            message: `Fetched ${emails.rowCount} emails successfully`,
            recipients: emailList
        });
    } catch (error) {
        console.error("Error fetching emails:", error.message);
        return response?.status?.(500)?.json?.("Internal Server Error");
    }
};

// Example manual test (remove this when using in Express route)
batchMailer(
    null,
    { status: (code) => ({ json: (msg) => console.log(`Response ${code}:`, msg) }) }
);
