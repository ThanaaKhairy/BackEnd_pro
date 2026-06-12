
//  Generic 404 Handler 
export  const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    statusCode: 404,
  });
};


