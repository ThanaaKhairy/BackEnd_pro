const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  linkUrl: {
    type: String,
    required: [true, 'Link URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  imageUrl: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Check if ad is expired
advertisementSchema.methods.isExpired = function() {
  return new Date() > this.endDate;
};

// Check if ad is currently active (within date range)
advertisementSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

// Increment clicks
advertisementSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  await this.save();
  return this.clicks;
};

// Increment views
advertisementSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
  return this.views;
};

module.exports = mongoose.model('Advertisement', advertisementSchema);