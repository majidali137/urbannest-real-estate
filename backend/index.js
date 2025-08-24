// Import express
const express = require("express");
const app = express();

// Define a port
const PORT = 8000;

// Middleware (to parse JSON requests)
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, Express is running! 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
