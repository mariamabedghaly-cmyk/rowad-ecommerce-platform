const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Auto-expire blacklisted tokens after 30 days
blacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Blacklist', blacklistSchema);
