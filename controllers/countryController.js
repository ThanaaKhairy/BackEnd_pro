const connectDB = require('../config/database');
const countryService = require('../services/countryService');
const { countrySchema, updateCountrySchema, filterQuerySchema } = require('../validators/countryValidator');

// Helper function for validation
const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error = result.error.issues[0].message;
    throw new Error(error);
  }
  return result.data;
};

//  Get all countries 
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await countryService.getAllCountries();
    res.status(200).json({ countries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get country by ID 
exports.getCountryById = async (req, res) => {
  try {
    const { country_id } = req.query;
    const country = await countryService.getCountryById(country_id);
    res.status(200).json({ country });
  } catch (error) {
    if (error.message === 'Country not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

//  Get country by name 
exports.getCountryByName = async (req, res) => {
  try {
    const { name } = req.query;
    const country = await countryService.getCountryByName(name);
    res.status(200).json({ country });
  } catch (error) {
    if (error.message === 'Country not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};



//  Add new country 
exports.addCountry = async (req, res) => {
  try {
    
    //  Validate request body
    const validatedData = validate(countrySchema, req.body);
    
    const country = await countryService.addCountry(validatedData);
    res.status(201).json({ 
      message: 'Country added successfully!',
      country 
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('ID must contain') || 
        error.message.includes('Country code must be') ||
        error.message.includes('Color must be')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

//  Update country by ID 
exports.updateCountry = async (req, res) => {
  try {
    const { country_id } = req.query;
    
    //  Validate request body
    const validatedData = validate(updateCountrySchema, req.body);
    
    const country = await countryService.updateCountry(country_id, validatedData);
    res.status(200).json({ 
      message: 'Country updated successfully!',
      country 
    });
  } catch (error) {
    if (error.message === 'Country not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('must be') || error.message.includes('cannot be')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

//  Delete country by ID 
exports.deleteCountry = async (req, res) => {
  try {
    const { country_id } = req.query;
    const result = await countryService.deleteCountry(country_id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Country not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

//  Delete country by name 
exports.deleteCountryByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Please provide country name' });
    }
    
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Country name must be at least 2 characters' });
    }
    
    const result = await countryService.deleteCountryByName(name);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Country not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};