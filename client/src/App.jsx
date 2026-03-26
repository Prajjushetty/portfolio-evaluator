import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!username) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${username}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("User not found");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>GitHub Profile Viewer</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchProfile()}
        />
        <button onClick={fetchProfile}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {data && (
        <div className="profile-card">
          <img src={data.profile.avatar_url} alt="avatar" />
          <h2>{data.profile.name}</h2>
          <p>@{data.profile.login}</p>

          <div className="stats">
            <span>Followers: {data.profile.followers}</span>
            <span>Following: {data.profile.following}</span>
            <span>Repos: {data.profile.public_repos}</span>
          </div>
        </div>
      )}

      <div className="repo-container">
        {data &&
          data.repos.map((repo) => (
            <div key={repo.id} className="repo-card">
              <a href={repo.html_url} target="_blank">
                <h3>{repo.name}</h3>
              </a>
              <p>{repo.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;