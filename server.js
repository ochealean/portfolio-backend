import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { text } from "stream/consumers";

dotenv.config();

const app = express();
const PORT = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

// route to send email
app.post("/send-email", async (req, res) => {
    const {email, name, subject, message} = req.body;

    try{
        // create transporter
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            },
        });

        // email options
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact Form: ${subject}`,
            text:`
            Name: ${name}
            Email: ${email}
            Message: ${message}
            `,
        };

        // send email
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: "Email sent successfully!"});
    }catch(error){
        console.error(error);
        res.status(500).json({success: false, message: "Error sending email."});
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));