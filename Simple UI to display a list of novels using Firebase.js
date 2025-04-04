//Simple UI to display a list of novels using Firebase//
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const NovelsList = () => {
  const [novels, setNovels] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchNovels();
  }, [search, yearFilter, sortOrder]);

  const fetchNovels = async () => {
    let q = query(collection(db, "novels"));

    if (yearFilter) {
      q = query(q, where("release_year", "==", parseInt(yearFilter)));
    }
    if (search) {
      q = query(q, where("title", ">=", search), where("title", "<=", search + "\uf8ff"));
    }
    q = query(q, orderBy("price", sortOrder));
    
    const querySnapshot = await getDocs(q);
    setNovels(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Novels List</h1>
      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "8px", display: "block", width: "100%" }}
      />
      <select onChange={(e) => setYearFilter(e.target.value)} style={{ padding: "8px", marginBottom: "8px", display: "block" }}>
        <option value="">All Years</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>
      <select onChange={(e) => setSortOrder(e.target.value)} style={{ padding: "8px", marginBottom: "16px", display: "block" }}>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Title</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Author</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Price</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Year</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Genre</th>
          </tr>
        </thead>
        <tbody>
          {novels.map((novel) => (
            <tr key={novel.id}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{novel.title}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{novel.author}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>${novel.price.toFixed(2)}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{novel.release_year}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{novel.genre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NovelsList;
