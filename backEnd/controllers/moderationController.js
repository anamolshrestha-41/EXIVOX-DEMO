import ModerationSettings from '../models/ModerationSettings.js';

// Get current moderation settings
export const getModerationSettings = async (req, res) => {
  try {
    const settings = await ModerationSettings.getSettings();
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get moderation settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get moderation settings'
    });
  }
};

// Update moderation settings (admin only)
export const updateModerationSettings = async (req, res) => {
  try {
    const {
      enabled,
      strictMode,
      toxicityThreshold,
      keywordModerationEnabled,
      perspectiveApiEnabled,
      autoApproveEducational,
      customBannedWords,
      customEducationalWords
    } = req.body;

    const settings = await ModerationSettings.getSettings();
    
    // Update settings
    if (enabled !== undefined) settings.enabled = enabled;
    if (strictMode !== undefined) settings.strictMode = strictMode;
    if (toxicityThreshold !== undefined) settings.toxicityThreshold = toxicityThreshold;
    if (keywordModerationEnabled !== undefined) settings.keywordModerationEnabled = keywordModerationEnabled;
    if (perspectiveApiEnabled !== undefined) settings.perspectiveApiEnabled = perspectiveApiEnabled;
    if (autoApproveEducational !== undefined) settings.autoApproveEducational = autoApproveEducational;
    if (customBannedWords) settings.customBannedWords = customBannedWords;
    if (customEducationalWords) settings.customEducationalWords = customEducationalWords;
    
    settings.lastUpdated = new Date();
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Moderation settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update moderation settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update moderation settings'
    });
  }
};

// Test content moderation
export const testModeration = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for testing'
      });
    }
    
    // Import moderation functions
    const { aiContentModeration } = await import('../middleware/aiModerationMiddleware.js');
    
    // Create mock request object
    const mockReq = {
      body: {
        title: text,
        description: '',
        tags: ''
      }
    };
    
    let moderationResult = null;
    
    // Create mock response and next
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          moderationResult = { statusCode: code, ...data };
        }
      })
    };
    
    const mockNext = () => {
      moderationResult = { approved: true, message: 'Content approved' };
    };
    
    // Run moderation
    await aiContentModeration(mockReq, mockRes, mockNext);
    
    res.status(200).json({
      success: true,
      moderationResult: moderationResult || mockReq.moderationResult
    });
  } catch (error) {
    console.error('Test moderation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test moderation'
    });
  }
};