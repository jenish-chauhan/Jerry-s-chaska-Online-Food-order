const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema({
    adminId: {
        type: String, // String or ObjectId depending on how User.js is setup
        required: true
    },
    sessionToken: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically remove expired sessions after 24h
    }
});

const AdminSession = mongoose.model('AdminSession', adminSessionSchema);

module.exports = AdminSession;
