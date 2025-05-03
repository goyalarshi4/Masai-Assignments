//Build a React Movie Website using <Firebase //
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";

// 🔐 Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 📦 Context to share movie data
const MovieContext = createContext();
const useMovies = () => useContext(MovieContext);

const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const movieRef = ref(db, "movies");
    const unsubscribe = onValue(movieRef, (snapshot) => {
      const data = snapshot.val();
      const movieList = [];
      for (let id in data) {
        movieList.push({ id, ...data[id] });
      }
      setMovies(movieList);
    });
    return () => unsubscribe();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, db }}>
      {children}
    </MovieContext.Provider>
  );
};

// 🎨 Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 1rem;
`;
const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;
const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
`;
const Input = styled.input`
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
`;
const Textarea = styled.textarea`
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
`;

// 📝 Add/Edit Movie Form
const AddMovie = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const { movies, db } = useMovies();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.id === id);
  const [title, setTitle] = useState(movie?.title || "");
  const [description, setDescription] = useState(movie?.description || "");
  const [year, setYear] = useState(movie?.year || "");

  useEffect(() => {
    if (editing && movie) {
      setTitle(movie.title);
      setDescription(movie.description);
      setYear(movie.year);
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !year || isNaN(year)) {
      alert("All fields are required and year must be valid.");
      return;
    }

    const data = { title, description, year };
    if (editing) {
      await update(ref(db, `movies/${id}`), data);
    } else {
      const newRef = push(ref(db, "movies"));
      await set(newRef, data);
    }
    navigate("/movies");
  };

  return (
    <Container>
      <h2>{editing ? "Edit" : "Add"} Movie</h2>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          rows="3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Release Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Button type="submit">{editing ? "Update" : "Add"} Movie</Button>
      </form>
    </Container>
  );
};

// 📄 Movie List Page
const MovieList = () => {
  const { movies, db } = useMovies();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      await remove(ref(db, `movies/${id}`));
    }
  };

  return (
    <Container>
      <h2>All Movies</h2>
      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
            <h3>{movie.title} ({movie.year})</h3>
            <p>{movie.description}</p>
            <Link to={`/add-movie/${movie.id}`}>
              <Button>Edit</Button>
            </Link>{" "}
            <Button onClick={() => handleDelete(movie.id)}>Delete</Button>
          </div>
        ))
      )}
    </Container>
  );
};

// 🧭 Navigation Bar
const Navigation = () => (
  <Nav>
    <Link to="/add-movie"><Button>Add Movie</Button></Link>
    <Link to="/movies"><Button>View Movies</Button></Link>
  </Nav>
);

// 🚀 Main App
const App = () => {
  return (
    <MovieProvider>
      <Router>
        <Container>
          <Navigation />
          <Routes>
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/add-movie/:id" element={<AddMovie />} />
            <Route path="/movies" element={<MovieList />} />
          </Routes>
        </Container>
      </Router>
    </MovieProvider>
  );
};

export default App;