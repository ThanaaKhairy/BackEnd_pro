const Country = require('../models/Country');

// Get all countries
const getAllCountries = async () => {
  const countries = await Country.find().sort({ country: 1 });
  return countries;
};

// Get country by ID
const getCountryById = async (id) => {
  const country = await Country.findOne({ country_id: id  });
  if (!country) {
    throw new Error('Country not found');
  }
  return country;
};

// Get country by name
const getCountryByName = async (name) => {
  const country = await Country.findOne({ 
    country: { $regex: new RegExp(`^${name}$`, 'i') }
  });
  if (!country) {
    throw new Error('Country not found');
  }
  return country;
};

// Add new country 
const addCountry = async (countryData) => {
  const existingCountry = await Country.findOne({ 
    $or: [
      {  country_id: countryData.country_id },
      { country: countryData.country }
    ]
  });
  
  if (existingCountry) {
    throw new Error('Country with same ID or name already exists');
  }
  
  const country = await Country.create(countryData);
  return country;
};

// Update country by ID 
const updateCountry = async (id, updateData) => {
  const country = await Country.findOne({ country_id: id });
  
  if (!country) {
    throw new Error('Country not found');
  }
  
  if (updateData.country_id && updateData.country_id !== id) {
const existingId = await Country.findOne({ country_id: updateData.country_id });
    if (existingId) {
      throw new Error('Country ID already exists');
    }
  }
  
  if (updateData.country && updateData.country !== country.country) {
    const existingName = await Country.findOne({ country: updateData.country });
    if (existingName) {
      throw new Error('Country name already exists');
    }
  }
  
  const updatedCountry = await Country.findOneAndUpdate(
    { country_id: id },
    updateData,
    { new: true, runValidators: true }
  );
  
  return updatedCountry;
};

// Delete country by ID 
const deleteCountry = async (id) => {
  const country = await Country.findOneAndDelete({ country_id: id });
  
  if (!country) {
    throw new Error('Country not found');
  }
  
  return { message: `Country '${country.country}' deleted successfully` };
};

// Delete country by name 
const deleteCountryByName = async (name) => {
  const country = await Country.findOneAndDelete({ 
    country: { $regex: new RegExp(`^${name}$`, 'i') }
  });
  
  if (!country) {
    throw new Error('Country not found');
  }
  
  return { message: `Country '${country.country}' deleted successfully` };
};



module.exports = {
  getAllCountries,
  getCountryById,
  getCountryByName,
  addCountry,
  updateCountry,
  deleteCountry,
  deleteCountryByName
};