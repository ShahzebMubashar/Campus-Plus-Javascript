import nodemailer from "nodemailer"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, phone, message } = req.body

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: "productionsbymultidexters@gmail.com", // Your Gmail address
                pass: "vpll gqvq lvnc embl", // Your Gmail password or app-specific password
            },
        })

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
            })

            res.status(200).json({ message: "Email sent successfully" })
        } catch (error) {
            console.error("Error sending email:", error)
            res.status(500).json({ message: "Error sending email" })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

