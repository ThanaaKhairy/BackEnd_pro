const connectDB = require('../config/database');
const advertisementService = require('../services/advertisementService');
const {
  createAdSchema,
  updateAdSchema
} = require('../validators/advertisementValidator');
const {
  validateRequiredFields,
  validateRequiredQuery,
  validateUpdateData,
  getErrorResponse
} = require('../utils/validationHelpers');

// Helper function for validation
const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
};

// ============== PUBLIC APIs ==============

// Get all active ads
exports.getAllActiveAds = async (req, res) => {
  try {
    await connectDB();
    const ads = await advertisementService.getAllActiveAds();
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Get single ad by ID
exports.getAdById = async (req, res) => {
  try {
    await connectDB();
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const ad = await advertisementService.getAdById(id);
    
    // Increment views (don't await, fire and forget)
    advertisementService.incrementViews(id).catch(err => {
      console.error('Failed to increment views:', err.message);
    });
    
    res.status(200).json({
      success: true,
      ad
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Track ad click (redirect to link)
exports.trackAdClick = async (req, res) => {
  try {
    await connectDB();
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const ad = await advertisementService.getAdById(id);
    
    // Increment clicks
    await advertisementService.incrementClicks(id);
    
    // Redirect to the actual link
    res.redirect(ad.linkUrl);
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    if (status === 400 || status === 404) {
      return res.status(status).json({ error: message });
    }
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// ============== ADMIN APIs ==============

// Get all ads (Admin only)
exports.getAllAds = async (req, res) => {
  try {
    await connectDB();
    const ads = await advertisementService.getAllAds();
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Get active ads (Admin only)
exports.getActiveAds = async (req, res) => {
  try {
    await connectDB();
    const ads = await advertisementService.getActiveAds();
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Get inactive ads (Admin only)
exports.getInactiveAds = async (req, res) => {
  try {
    await connectDB();
    const ads = await advertisementService.getInactiveAds();
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Get expired ads (Admin only)
exports.getExpiredAds = async (req, res) => {
  try {
    await connectDB();
    const ads = await advertisementService.getExpiredAds();
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Create new ad (Admin only)
exports.createAd = async (req, res) => {
  try {
    await connectDB();
    const requiredFields = ['title', 'description', 'companyName', 'linkUrl', 'startDate', 'endDate'];
    validateRequiredFields(req.body, requiredFields);
    
    const validatedData = validate(createAdSchema, req.body);
    const ad = await advertisementService.createAd(validatedData, req.user.user_id);
    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully!',
      ad
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Update ad (Admin only)
exports.updateAd = async (req, res) => {
  try {
    await connectDB();
    validateRequiredQuery(req.query, ['id']);
    validateUpdateData(req.body, ['title', 'description', 'companyName', 'linkUrl', 'startDate', 'endDate', 'position']);
    
    const { id } = req.query;
    const validatedData = validate(updateAdSchema, req.body);
    const ad = await advertisementService.updateAd(id, validatedData);
    res.status(200).json({
      success: true,
      message: 'Advertisement updated successfully!',
      ad
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Toggle ad active status (Admin only)
exports.toggleAdStatus = async (req, res) => {
  try {
    await connectDB();
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const result = await advertisementService.toggleAdStatus(id);
    res.status(200).json({
      success: true,
      message: result.message,
      isActive: result.isActive
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Delete ad (Admin only)
exports.deleteAd = async (req, res) => {
  try {
    await connectDB();
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const result = await advertisementService.deleteAd(id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Advertisement');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};