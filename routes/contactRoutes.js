const express = require('express');
const router = express.Router();
const { 
    addInquiry, 
    getInquiries, 
    updateInquiryStatus, 
    deleteInquiry 
} = require('../controllers/inquiryController');

router.post('/contact', addInquiry);
router.get('/inquiries', getInquiries);
router.put('/inquiries/:id/status', updateInquiryStatus);
router.delete('/inquiries/:id', deleteInquiry); // New Delete Route

module.exports = router;