import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [username, setUsername] = useState("octocat");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGitHubData = async () => {
    try {
      setLoading(true);
      setError("");

      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found");

      const userData = await userRes.json();
      setUser(userData);

      const repoRes = await fetch(userData.repos_url);
      const repoData = await repoRes.json();
      setRepos(repoData);

    } catch (err) {
      setError(err.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData(); // default load
  }, []);

return (
  <div className="container">
    <h1>GitHub Profile Viewer</h1>

    <div className="search-box">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button onClick={fetchGitHubData}>Search</button>
    </div>

    {loading && <p>Loading...</p>}
    {error && <p style={{ color: "red" }}>{error}</p>}

    {user && !loading && (
      <div className="card">
        <img src={user.avatar_url} alt="avatar" width="100" />
        <h2>{user.name}</h2>
        <p>@{user.login}</p>
        <p>Followers: {user.followers}</p>
        {user.bio && <p>{user.bio}</p>}
        {user.location && <p>📍 {user.location}</p>}
        <a href={user.html_url} target="_blank" rel="noreferrer">
          View GitHub Profile
        </a>
      </div>
    )}

    <div className="repo-container">
      {repos.length === 0 && !loading && !error && (
        <p>No repositories found.</p>
      )}

      {repos.map((repo) => (
        <div key={repo.id} className="repo-card">
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            <h3>{repo.name}</h3>
          </a>

          <p>{repo.description || "No description available"}</p>
          <p>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</p>
          {repo.language && <p>💻 {repo.language}</p>}
        </div>
      ))}
    </div>
  </div>
);
}

export default App;