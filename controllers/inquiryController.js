const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

exports.addInquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Subject and Message are required"
            });
        }

        const newInquiry = await Inquiry.create({
            name,
            email,
            phone: phone || "Not provided",
            subject,
            message
        });

        // Email Notification
        const mailOptions = {
            from: `"Shri Components" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            replyTo: email,
            subject: `New Inquiry: ${subject}`,
            html: `
                <h2>New Contact Inquiry Received</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
                <br>
                <small>Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</small>
            `
        };

        await transporter.sendMail(mailOptions).catch(err => {
            console.error("Email notification failed:", err);
        });

        res.status(201).json({
            success: true,
            message: "Thank you! Your message has been sent successfully."
        });

    } catch (error) {
        console.error("Inquiry Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save inquiry. Please try again."
        });
    }
};

exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, inquiries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch inquiries" });
    }
};

exports.updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

        res.json({ success: true, inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};



exports.deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInquiry = await Inquiry.findByIdAndDelete(id);

        if (!deletedInquiry) {
            return res.status(404).json({ 
                success: false, 
                message: "Inquiry not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "Inquiry deleted successfully" 
        });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete inquiry" 
        });
    }
};