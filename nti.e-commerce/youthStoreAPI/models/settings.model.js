const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Youth Store' },
  heroTitle: { type: String, default: 'Unleash Your Style' },
  heroSubtitle: { type: String, default: 'Discover the latest trends in youth fashion.' },
  newArrivalsTitle: { type: String, default: 'New Arrivals' },
  contactEmail: { type: String, default: 'contact@youthstore.com' },
  phone: { type: String, default: '01105809783' },
  address: { type: String, default: 'Cairo, Egypt' },
  socialLinks: {
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    twitter: { type: String, default: '#' }
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
