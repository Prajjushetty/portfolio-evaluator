import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("octocat");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGitHubData = async (name = username) => {
    if (!name.trim()) {
      setError("Please enter a GitHub username");
      setUser(null);
      setRepos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userRes = await fetch(`https://api.github.com/users/${name}`);
      if (!userRes.ok) {
        throw new Error("User not found");
      }

      const userData = await userRes.json();
      setUser(userData);

      const repoRes = await fetch(userData.repos_url);
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err) {
      setError("User not found");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  return (
    <div className="container">
      <h1>GitHub Profile Viewer</h1>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            const value = e.target.value;
            setUsername(value);
            setError("");

            if (value.trim().length > 2) {
              fetchGitHubData(value);
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && fetchGitHubData()}
          placeholder="Enter GitHub username"
        />
        <button onClick={() => fetchGitHubData()}>Search</button>
      </div>

      {/* Loading */}
      {loading && <p className="message">Loading profile...</p>}

      {/* Error UI */}
      {error && (
        <div className="error-box">
          <h3>⚠️ {error}</h3>
          <p>Please check the username and try again.</p>
        </div>
      )}

      {/* Profile Card */}
      {user && !loading && !error && (
        <div className="card">
          <img src={user.avatar_url} alt="avatar" width="100" />
          <h2>{user.name || user.login}</h2>
          <p>@{user.login}</p>

          {/* Stats */}
          <p>📦 Public Repos: {user.public_repos}</p>
          <p>👥 Followers: {user.followers}</p>
          <p>➡️ Following: {user.following}</p>

          {user.bio && <p>{user.bio}</p>}
          {user.location && <p>📍 {user.location}</p>}

          <a href={user.html_url} target="_blank" rel="noreferrer">
            View GitHub Profile
          </a>
        </div>
      )}

      {/* Top Repos */}
      {user && !loading && !error && (
        <>
          <h2 className="repo-heading">Top Repositories</h2>

          <div className="repo-container">
            {topRepos.length === 0 && <p>No repositories found.</p>}

            {topRepos.map((repo, index) => (
              <div key={repo.id} className="repo-card">
                <p>
                  <strong>Rank #{index + 1}</strong>
                </p>

                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  <h3>{repo.name}</h3>
                </a>

                <p>{repo.description || "No description available"}</p>

                <p>
                  ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
                </p>

                {repo.language && <p>💻 {repo.language}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;