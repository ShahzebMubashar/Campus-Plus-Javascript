// backend/controllers/contactController.js
const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "productionsbymultidexters@gmail.com",
                pass: "vpll gqvq lvnc embl",
            },
        });

        const mailOptions = {
            from: email,
            to: 'productionsbymultidexters@gmail.com',
            subject: `Message from ${firstName} ${lastName}`,
            text: message,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
};

module.exports = { sendEmail };


// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.sendEmail);

module.exports = router;


// backend/src/Server.js
// ... other imports ...
const contactRoutes = require('../routes/emailRoutes');
// ... other middleware ...

app.use('/api/contact', contactRoutes);

// ... other code ...
