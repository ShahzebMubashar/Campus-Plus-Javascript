const pool = require('../config/database');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAILER_PASS
    }
});

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const batchMailer = async (request, response) => {
    const { body: { message, subject } } = request;

    if (!message || !subject)
        return response.status(400).json("Subject and message are required");

    try {
        const emails = await pool.query(`SELECT email FROM Users`);

        if (!emails.rowCount) {
            return response.status(400).json("No registered Users found");
        }

        let emailList = emails.rows.map(user => user.email);

        emailList = emailList.filter(isValidEmail);

        if (!emailList.length) {
            return response.status(400).json("No valid email addresses found");
        }

        const sendResults = await Promise.all(
            emailList.map(async (email) => {
                try {
                    await transporter.sendMail({
                        from: `"Your Name" <${process.env.EMAIL_USER}>`,
                        to: email,
                        subject,
                        text: message,
                        html: `<p>${message}</p>`
                    });

                    return { email, status: 'sent' };
                } catch (err) {
                    console.error(`Failed to send email to ${email}:`, err.message);
                    return { email, status: 'failed', error: err.message };
                }
            })
        );

        const failed = sendResults.filter(result => result.status === 'failed');

        return response.status(200).json({
            message: `Emails sent to ${emailList.length} valid users`,
            failedRecipients: failed
        });

    } catch (error) {
        console.error("Error fetching emails:", error.message);
        return response.status(500).json("Internal Server Error");
    }
};

async function getValidEmails() {
    const client = await pool.connect();

    try {
        const result = await client.query("Select * from ViewUserEmails");

        if (!result.rowCount) return [];

        const emails = result.rows.map(row => row.email);

        return emails.filter(email => isValidEmail(email));
    } catch (error) {
        console.error("Error fetching valid emails:", error.message);
    } finally {
        client.release();
    }
} 

module.exports = {
    batchMailer,
    getValidEmails,
    isValidEmail,
    transporter,
};
