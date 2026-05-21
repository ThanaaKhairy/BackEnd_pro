const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
 country_id: {
  type: String,
  required: [true, 'Country ID is required'],
  unique: true,
  trim: true
},
  country: {
    type: String,
    required: [true, 'Country name is required'],
    unique: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
    uppercase: true,
    trim: true
  },
  visaName: {
    type: String,
    required: [true, 'Visa name is required']
  },
  visaType: {
    type: String,
    required: true,
    enum: ['Residence', 'Short-stay', 'Temporary residence', 'Long-term visa', 'Remote work permit']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  minIncomeMonthly: {
    type: Number,
    required: true
  },
  minIncomeYearly: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  currencySymbol: {
    type: String,
    required: true
  },
  durationMonths: {
    type: Number,
    required: true
  },
  renewableYears: {
    type: Number,
    required: true
  },
  processingWeeks: {
    type: Number,
    required: true
  },
  costUSD: {
    type: Number,
    required: true
  },
  costOfLivingIndex: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  coordinates: {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true }
  },
  requirements: {
    type: [String],
    required: true
  },
  benefits: {
    type: [String],
    required: true
  },
  restrictions: {
    type: [String],
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  safetyRating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  internetSpeed: {
    type: Number,
    required: true
  },
  englishProficiency: {
    type: String,
    required: true,
    enum: ['Low', 'Low to Moderate', 'Moderate', 'High', 'Native']
  },
  timezone: {
    type: String,
    required: true
  },
  qualityOfLife: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  bestFor: {
    type: [String],
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Country', countrySchema);