const express = require("express");

const app = express();
const routerHandler = require("./routes");

// API read JSON from Postman
app.use(express.json());

//check to make sure the API is running
app.get("/", (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "Glow Client Care API is running"
    });
});

// main API routes here
app.use("/api/v1", routerHandler);

module.exports = app;