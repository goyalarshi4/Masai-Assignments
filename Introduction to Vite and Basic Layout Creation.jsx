//Introduction to Vite and Basic Layout Creation//
import React from "react";

function App() {
  return (
    <>
      <style>
        {`
          .container {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: auto;
            padding: 20px;
          }

          header {
            background-color: #333;
            color: white;
            padding: 1rem;
            text-align: center;
          }

          nav {
            display: flex;
            justify-content: center;
            background-color: #f1f1f1;
            padding: 0.75rem;
            gap: 2rem;
          }

          nav a {
            text-decoration: none;
            color: #333;
            font-weight: bold;
          }

          main {
            padding: 1.5rem;
            text-align: center;
          }

          footer {
            text-align: center;
            padding: 1rem;
            background-color: #e4e4e4;
            margin-top: 2rem;
          }
        `}
      </style>

      <div className="container">
        <header>
          <h1>Welcome to My Vite Page</h1>
        </header>

        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        <main>
          <h2>Hello, Visitor!</h2>
          <p>This is a simple layout built with React and Vite.</p>
        </main>

        <footer>
          <p>&copy; 2025 My Vite Website. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
