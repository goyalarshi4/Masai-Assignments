//Controlled Form Basics

//
import React, { useState } from "react";

function ControlledForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
    setError(""); // Clear error on typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      setError("Username is required!");
    } else {
      alert(`Submitted Username: ${username}`);
      setUsername(""); // Reset input field
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Controlled Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default ControlledForm;
