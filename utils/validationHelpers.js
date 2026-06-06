// utils/validationHelpers.js

/**
 * Check if required fields exist in request body
 * @param {Object} body - Request body object
 * @param {Array<string>} requiredFields - Array of required field names
 * @throws {Error} If any required field is missing
 */
const validateRequiredFields = (body, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (body[field] === undefined || 
        body[field] === null || 
        (typeof body[field] === 'string' && body[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};

/**
 * Check if required query parameters exist
 * @param {Object} query - Request query object
 * @param {Array<string>} requiredParams - Array of required parameter names
 * @throws {Error} If any required parameter is missing
 */
const validateRequiredQuery = (query, requiredParams) => {
  const missingParams = [];
  
  for (const param of requiredParams) {
    if (query[param] === undefined || 
        query[param] === null || 
        query[param].trim() === '') {
      missingParams.push(param);
    }
  }
  
  if (missingParams.length > 0) {
    throw new Error(`Missing required query parameters: ${missingParams.join(', ')}`);
  }
  
  return true;
};

/**
 * Check if there's data to update
 * @param {Object} body - Request body object
 * @throws {Error} If no data provided for update
 */
const validateUpdateData = (body, availableFields = null) => {
  if (!body || Object.keys(body).length === 0) {
    const message = availableFields 
      ? `No data provided for update. Please provide at least one field to update. Available fields: ${availableFields.join(', ')}`
      : 'No data provided for update. Please provide at least one field to update.';
    throw new Error(message);
  }
  return true;
};

/**
 * Validate ID parameter exists and is valid
 * @param {string} id - ID value from request
 * @param {string} entityName - Name of the entity (e.g., 'Post', 'Advertisement')
 * @throws {Error} If ID is missing or invalid
 */
const validateId = (id, entityName = 'Item') => {
  if (!id || id.trim() === '') {
    throw new Error(`${entityName} ID is required. Please provide a valid ID.`);
  }
  return id.trim();
};

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @param {string} entityName - Name of the entity (e.g., 'Post', 'Advertisement')
 * @returns {Object} Formatted error response
 */
const getErrorResponse = (error, entityName = 'Item') => {
  const errorMap = {
    // Missing field errors
    'Missing required fields': {
      status: 400,
      getMessage: (msg) => msg
    },
    'Missing required query parameters': {
      status: 400,
      getMessage: (msg) => msg
    },
    'No data provided for update': {
      status: 400,
      getMessage: (msg) => msg
    },
    // Not found errors
    [`${entityName} not found`]: {
      status: 404,
      getMessage: () => `The ${entityName.toLowerCase()} you are looking for could not be found. Please check the ID and try again.`
    },
    // Permission errors
    'You can only update your own posts': {
      status: 403,
      getMessage: () => 'You are not authorized to update this item. You can only update items that you created.'
    },
    'You can only delete your own posts': {
      status: 403,
      getMessage: () => 'You are not authorized to delete this item. You can only delete items that you created.'
    },
    'You can only delete your own comments': {
      status: 403,
      getMessage: () => 'You are not authorized to delete this comment. You can only delete comments that you created.'
    },
    // Like/Unlike errors
    'You already liked this post': {
      status: 400,
      getMessage: () => 'You have already liked this post. You cannot like a post more than once.'
    },
    'You have not liked this post': {
      status: 400,
      getMessage: () => 'You have not liked this post. You cannot unlike a post that you have not liked.'
    },
    // Date errors
    'Start date must be before end date': {
      status: 400,
      getMessage: () => 'Invalid date range. The start date must be earlier than the end date.'
    },
    // URL errors
    'Invalid URL': {
      status: 400,
      getMessage: () => 'Invalid URL format. Please provide a valid URL (e.g., https://example.com).'
    }
  };

  // Check if error matches any known pattern
  for (const [key, config] of Object.entries(errorMap)) {
    if (error.message.includes(key)) {
      return {
        status: config.status,
        message: config.getMessage(error.message)
      };
    }
  }

  // Check for "not found" errors with different entity names
  if (error.message.includes('not found')) {
    return {
      status: 404,
      message: `The ${entityName.toLowerCase()} you are looking for could not be found.`
    };
  }

  // Default error
  return {
    status: 500,
    message: 'Internal server error. Please try again later.',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
};

module.exports = {
  validateRequiredFields,
  validateRequiredQuery,
  validateUpdateData,
  validateId,
  getErrorResponse
};