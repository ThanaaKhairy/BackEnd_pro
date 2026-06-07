const axios = require('axios');

const NEWS_API_KEY = process.env.VITE_NEWSAPI_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// جلب الأخبار بناءً على موضوع البحث
const getEverything = async (req, res) => {
  try {
        const { country } = req.params; 

    const { pageSize = 100 } = req.query;
   const query = `"${country}" AND ("visa requirements" OR "travel documents" OR "visa application" OR "entry requirements" OR "embassy visa" OR "passport requirements" OR "visa fees" OR "travel advisory" OR "digital nomad visa" OR "work permit" OR "residence permit" OR "immigration" OR "border control" OR "e-visa" OR "visa on arrival" OR "visa free" OR "schengen visa" OR "tourist visa" OR "business visa")`;

    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        pageSize: pageSize,
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
      message: 'فشل في جلب الأخبار',
      error: error.response?.data?.message || error.message,
    });
  }
};

// 
module.exports = { getEverything };