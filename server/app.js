const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});