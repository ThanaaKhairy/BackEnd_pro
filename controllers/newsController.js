const axios = require('axios');

const NEWS_API_KEY = process.env.VITE_NEWSAPI_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const getEverything = async (req, res) => {
  try {
    const { pageSize = 50, country = 'travel', query } = req.query;

    // استخدم query من الفرونت لو موجود
    const searchQuery = query || `"${country}" AND (travel OR visa OR passport OR embassy OR "entry requirements")`;

    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: searchQuery,
        pageSize,
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
      },
    });

    res.status(200).json({
      success: true,
      articles: response.data.articles,
      totalResults: response.data.totalResults,
    });

  } catch (error) {
    console.error('NewsAPI Error:', error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.response?.data?.message || error.message,
    });
  }
};

module.exports = { getEverything };