import mongoose from 'mongoose';

const moderationSettingsSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true
  },
  strictMode: {
    type: Boolean,
    default: false
  },
  toxicityThreshold: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  keywordModerationEnabled: {
    type: Boolean,
    default: true
  },
  perspectiveApiEnabled: {
    type: Boolean,
    default: false
  },
  autoApproveEducational: {
    type: Boolean,
    default: true
  },
  customBannedWords: [{
    type: String,
    lowercase: true
  }],
  customEducationalWords: [{
    type: String,
    lowercase: true
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Ensure only one settings document exists
moderationSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('ModerationSettings', moderationSettingsSchema);