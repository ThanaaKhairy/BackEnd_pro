const Advertisement = require('../models/Advertisement');

// Get all active ads (for public)
const getAllActiveAds = async () => {
  const now = new Date();
  const ads = await Advertisement.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ position: 1, createdAt: -1 });
  
  return ads;
};

// Get single ad by ID
const getAdById = async (adId) => {
  const ad = await Advertisement.findById(adId);
  
  if (!ad) {
    throw new Error('Advertisement not found');
  }
  
  return ad;
};

// Get all ads (Admin only)
const getAllAds = async () => {
  const ads = await Advertisement.find().sort({ createdAt: -1 });
  return ads;
};

// Get active ads (Admin only)
const getActiveAds = async () => {
  const ads = await Advertisement.find({ isActive: true }).sort({ position: 1 });
  return ads;
};

// Get inactive ads (Admin only)
const getInactiveAds = async () => {
  const ads = await Advertisement.find({ isActive: false }).sort({ createdAt: -1 });
  return ads;
};

// Get expired ads (Admin only)
const getExpiredAds = async () => {
  const now = new Date();
  const ads = await Advertisement.find({
    endDate: { $lt: now }
  }).sort({ endDate: -1 });
  
  return ads;
};

// Create new ad (Admin only)
const createAd = async (adData, adminId) => {
  // Check if dates are valid
  if (new Date(adData.startDate) >= new Date(adData.endDate)) {
    throw new Error('Start date must be before end date');
  }
  
  const ad = await Advertisement.create({
    title: adData.title,
    description: adData.description,
    companyName: adData.companyName,
    linkUrl: adData.linkUrl,
    startDate: adData.startDate,
    endDate: adData.endDate,
    position: adData.position || 0,
    createdBy: adminId
  });
  
  return ad;
};

// Update ad (Admin only)
const updateAd = async (adId, updateData) => {
  const ad = await Advertisement.findById(adId);
  
  if (!ad) {
    throw new Error('Advertisement not found');
  }
  
  // Update fields
  if (updateData.title) ad.title = updateData.title;
  if (updateData.description) ad.description = updateData.description;
  if (updateData.companyName) ad.companyName = updateData.companyName;
  if (updateData.linkUrl) ad.linkUrl = updateData.linkUrl;
  if (updateData.startDate) ad.startDate = updateData.startDate;
  if (updateData.endDate) ad.endDate = updateData.endDate;
  if (updateData.position !== undefined) ad.position = updateData.position;
  
  // Validate dates if both are being updated
  if (ad.startDate >= ad.endDate) {
    throw new Error('Start date must be before end date');
  }
  
  await ad.save();
  
  return ad;
};

// Toggle ad active status (Admin only)
const toggleAdStatus = async (adId) => {
  const ad = await Advertisement.findById(adId);
  
  if (!ad) {
    throw new Error('Advertisement not found');
  }
  
  ad.isActive = !ad.isActive;
  await ad.save();
  
  const status = ad.isActive ? 'activated' : 'deactivated';
  return { 
    message: `Advertisement '${ad.title}' has been ${status} successfully!`,
    isActive: ad.isActive
  };
};

// Delete ad (Admin only)
const deleteAd = async (adId) => {
  const ad = await Advertisement.findById(adId);
  
  if (!ad) {
    throw new Error('Advertisement not found');
  }
  
  await Advertisement.findByIdAndDelete(adId);
  
  return { message: `Advertisement '${ad.title}' has been deleted successfully!` };
};

// Increment ad clicks
const incrementClicks = async (adId) => {
  const ad = await Advertisement.findById(adId);
  
  if (!ad) {
    throw new Error('Advertisement not found');
  }
  
  await ad.incrementClicks();
  
  return { clicks: ad.clicks };
};

// Increment ad views
const incrementViews = async (adId) => {
  const ad = await Advertisement.findById(adId);
  
  if (!ad) {
    throw new Error('Advertisement not found');
  }
  
  await ad.incrementViews();
  
  return { views: ad.views };
};

module.exports = {
  getAllActiveAds,
  getAdById,
  getAllAds,
  getActiveAds,
  getInactiveAds,
  getExpiredAds,
  createAd,
  updateAd,
  toggleAdStatus,
  deleteAd,
  incrementClicks,
  incrementViews
};