import { useState, useEffect } from "react";

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

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button onClick={fetchGitHubData}>Search</button>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error} ❌</p>}

      {/* User Info */}
      {user && !loading && (
        <div className="card">
          <img src={user.avatar_url} alt="" width="100" />
          <h2>{user.name}</h2>
          <p>@{user.login}</p>
          <p>Followers: {user.followers}</p>
        </div>
      )}

      {/* Repo List */}
      <div className="repo-container">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <h3>{repo.name}</h3>
            <p>⭐ {repo.stargazers_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;