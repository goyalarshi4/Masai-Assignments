//Dynamic Blog Page with Featured Highlight

//
import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

// Blog array
const blogs = [
  { title: "React Basics", content: "Learn the basics of React.", isFeatured: true },
  { title: "Advanced React", content: "Delve deeper into React.", isFeatured: false },
  { title: "React Performance Tips", content: "Optimize your React apps.", isFeatured: true },
];

// Blog component
const BlogPost = ({ title, content, isFeatured }) => {
  return (
    <div
      style={{
        ...styles.blog,
        backgroundColor: isFeatured ? "#fff9c4" : "#f5f5f5", // light yellow if featured
      }}
    >
      <h2>{title}</h2>
      <p>{content}</p>
      {isFeatured && <span style={styles.badge}>🌟 Featured</span>}
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Blog Posts</h1>
      {blogs.map((blog, index) => (
        <BlogPost
          key={index}
          title={blog.title}
          content={blog.content}
          isFeatured={blog.isFeatured}
        />
      ))}
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  blog: {
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
  },
  badge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "5px 10px",
    backgroundColor: "#ffe082",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "12px",
  },
};

ReactDOM.render(<App />, document.getElementById("root"));
