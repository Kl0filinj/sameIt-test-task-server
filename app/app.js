const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(logger("short"));
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});

module.exports = app;
