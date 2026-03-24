const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();

const getUserData = async (username) => {
  const user = await octokit.users.getByUsername({
    username,
  });

  const repos = await octokit.repos.listForUser({
    username,
    per_page: 100,
  });

  return {
    profile: user.data,
    repos: repos.data,
  };
};

module.exports = { getUserData };