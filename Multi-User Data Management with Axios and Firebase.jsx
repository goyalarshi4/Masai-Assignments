//Multi-User Data Management with Axios and Firebase//
import React, { useEffect, useState } from "react";
import axios from "axios";

const firebaseURL = "https://your-firebase-db.firebaseio.com/users"; // Replace with your actual Firebase URL

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${firebaseURL}.json`);
      const data = res.data;
      const userList = data
        ? Object.entries(data).map(([id, user]) => ({ id, ...user }))
        : [];
      setUsers(userList);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email } = form;
    if (!name.trim() || !email.trim()) {
      setError("Both fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      if (editId) {
        await axios.patch(`${firebaseURL}/${editId}.json`, form);
      } else {
        await axios.post(`${firebaseURL}.json`, form);
      }
      setForm({ name: "", email: "" });
      setEditId(null);
      setError("");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Error submitting data.");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${firebaseURL}/${id}.json`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Error deleting user.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>User Management System</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Add"} User</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Users List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <b>{user.name}</b> - {user.email}{" "}
            <button onClick={() => handleEdit(user)}>Edit</button>{" "}
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
