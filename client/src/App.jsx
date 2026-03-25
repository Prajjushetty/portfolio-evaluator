import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);

  const fetchProfile = async () => {
    const res = await fetch(`http://localhost:5000/api/profile/${username}`);
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>GitHub Profile Viewer</h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={fetchProfile}>Search</button>

      {data && (
        <div>
          <h2>{data.profile.login}</h2>
          <p>Followers: {data.profile.followers}</p>
          <p>Public Repos: {data.profile.public_repos}</p>
        </div>
      )}
    </div>
  );
}

export default App;