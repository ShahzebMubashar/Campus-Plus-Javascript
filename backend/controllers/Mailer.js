const pool = require('../config/database');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAILER_PASS
    }
});

const batchMailer = async (request, response) => {
    const { body: { message, subject } } = request;

    if (!message || !subject)
        return response.status(400).json("Subject and message are required");

    try {
        const emails = await pool.query(`SELECT email FROM Users`);

        if (!emails.rowCount) {
            console.log("No registered Users found");
            return response.status(400).json("No registered Users found");
        }

        const emailList = emails.rows.map(user => user.email);
        console.log(`Sending emails to ${emailList.length} users in parallel...`);

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
                    console.log(`Email sent to ${email}`);
                    return { email, status: 'sent' };
                } catch (err) {
                    console.error(`Failed to send email to ${email}:`, err.message);
                    return { email, status: 'failed', error: err.message };
                }
            })
        );

        const failed = sendResults.filter(result => result.status === 'failed');

        return response.status(200).json({
            message: `Emails sent to ${emailList.length} users`,
            failedRecipients: failed
        });

    } catch (error) {
        console.error("Error fetching emails:", error.message);
        return response.status(500).json("Internal Server Error");
    }
};

module.exports = {
    batchMailer
};
