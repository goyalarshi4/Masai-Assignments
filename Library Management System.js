//Library Management System//
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const LibraryManagement = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, [search, genreFilter, availabilityFilter, sortField, sortOrder, page]);

  const fetchBooks = async () => {
    let q = query(collection(db, "books"), orderBy(sortField, sortOrder));
    if (genreFilter) {
      q = query(q, where("genre", "==", genreFilter));
    }
    if (availabilityFilter) {
      q = query(q, where("available", "==", availabilityFilter === "true"));
    }
    const querySnapshot = await getDocs(q);
    setBooks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
  };

  const fetchMembers = async () => {
    const querySnapshot = await getDocs(collection(db, "members"));
    setMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Library Management</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "8px", display: "block", width: "100%" }}
      />
      <select onChange={(e) => setGenreFilter(e.target.value)} style={{ padding: "8px", marginBottom: "8px", display: "block" }}>
        <option value="">All Genres</option>
        <option value="Science Fiction">Science Fiction</option>
        <option value="Dystopian">Dystopian</option>
      </select>
      <select onChange={(e) => setAvailabilityFilter(e.target.value)} style={{ padding: "8px", marginBottom: "16px", display: "block" }}>
        <option value="">All</option>
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </select>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Title</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Author</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Genre</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Year</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Available</th>
          </tr>
        </thead>
        <tbody>
          {books.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((book) => (
            <tr key={book.id}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.title}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.author}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.genre}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.publishedYear}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.available ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} style={{ marginRight: "8px", padding: "8px" }}>Previous</button>
        <button onClick={() => setPage(prev => prev + 1)} style={{ padding: "8px" }}>Next</button>
      </div>
    </div>
  );
};

export default LibraryManagement;
