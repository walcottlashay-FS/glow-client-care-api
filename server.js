require("dotenv").config();

const app = require("./app/index");
const connectDB = require("./app/db/config");

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});