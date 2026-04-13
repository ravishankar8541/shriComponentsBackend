const Inquiry = require('../models/Inquiry');

// Nodemailer removed as Web3Forms will handle the email delivery

exports.addInquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Subject and Message are required"
            });
        }

        // 1. Save to MongoDB (Keeping your existing logic)
        const newInquiry = await Inquiry.create({
            name,
            email,
            phone: phone || "Not provided",
            subject,
            message
        });

        // 2. Email Notification via Web3Forms API
        // This is called from the backend so it remains hidden from the user
        try {
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: "07908e2d-6bbd-4414-9cc0-b93ad07a1a14",
                    name: name,
                    email: email,
                    subject: `New Inquiry: ${subject}`,
                    phone: phone || "Not provided",
                    message: message,
                    from_name: "Shri Components Portal",
                    // Web3Forms will send this to the email associated with your access key
                }),
            });
        } catch (mailError) {
            // We log the error but still send a success response to the user 
            // because the data was successfully saved to your MongoDB.
            console.error("Web3Forms Email Notification failed:", mailError);
        }

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

// --- Rest of your functions remain exactly the same ---

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