export const errorHandler = (error, _request, response, _next) => {
  console.error("Request failed:", error.message);
  response.status(500).json({ success: false, message: "Internal Server Error" });
};

export default errorHandler;
