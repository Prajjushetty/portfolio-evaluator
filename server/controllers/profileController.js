const { getUserData } = require("../services/githubService");

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const data = await getUserData(username);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

module.exports = { getProfile };