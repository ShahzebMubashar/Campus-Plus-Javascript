const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")
require("dotenv").config()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

// Middleware to validate email request body
const validateEmailBody = (req, res, next) => {
    const { name, email, phone, message } = req.body
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "Missing required fields" })
    }
    next()
}

// Email sending route
router.post("/send-email", validateEmailBody, async (req, res) => {
    const { name, email, phone, message } = req.body

    try {
        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "productionsbymultidexters@gmail.com",
            subject: "New Contact Form Submission",
            text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
        })

        res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
        console.error("Error sending email:", error)
        res.status(500).json({ message: "Error sending email", error: error.message })
    }
})

// Test route to check if email service is working
router.get("/test-email", async (req, res) => {
    try {
        await transporter.verify()
        res.status(200).json({ message: "Email service is working correctly" })
    } catch (error) {
        console.error("Email service error:", error)
        res.status(500).json({ message: "Email service is not working", error: error.message })
    }
})

module.exports = router

