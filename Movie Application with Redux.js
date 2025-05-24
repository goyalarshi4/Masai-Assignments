//Movie Application with Redux//
// App.js
import React, { useEffect, useState } from 'react';
import {
  ChakraProvider, Box, Input, Button, Text, Image, VStack, Heading
} from '@chakra-ui/react';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// --- Redux Setup ---
const initialState = {
  movies: [],
  watchlist: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'ADD_TO_WATCHLIST':
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter((m) => m.imdbID !== action.payload),
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

// --- Components ---
const MovieCard = ({ movie, onAdd, onRemove, isInWatchlist }) => (
  <Box borderWidth="1px" p="4" borderRadius="md" w="100%">
    <Image src={movie.Poster} alt={movie.Title} boxSize="200px" />
    <Text fontWeight="bold">{movie.Title}</Text>
    <Text>{movie.Year}</Text>
    {!isInWatchlist ? (
      <Button mt="2" colorScheme="blue" onClick={() => onAdd(movie)}>
        Add to Watchlist
      </Button>
    ) : (
      <Button mt="2" colorScheme="red" onClick={() => onRemove(movie.imdbID)}>
        Remove
      </Button>
    )}
  </Box>
);

const MovieApp = () => {
  const dispatch = useDispatch();
  const { movies, watchlist } = useSelector((state) => state);
  const [query, setQuery] = useState('');

  const fetchMovies = async () => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=demo&s=${query}`
      );
      if (res.data.Search) {
        dispatch({ type: 'SET_MOVIES', payload: res.data.Search });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleAdd = (movie) =>
    dispatch({ type: 'ADD_TO_WATCHLIST', payload: movie });

  const handleRemove = (id) =>
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });

  return (
    <ChakraProvider>
      <Box p="6" maxW="800px" mx="auto">
        <Heading mb="4">Movie Search App 🎬</Heading>
        <Input
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          mb="4"
        />
        <Button onClick={fetchMovies} colorScheme="teal" mb="6">
          Search
        </Button>

        <Heading size="md" mb="2">Search Results:</Heading>
        <VStack spacing="4" align="stretch">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onAdd={handleAdd}
              onRemove={handleRemove}
              isInWatchlist={watchlist.some((m) => m.imdbID === movie.imdbID)}
            />
          ))}
        </VStack>

        <Heading size="md" mt="10" mb="2">Watchlist:</Heading>
        <VStack spacing="4" align="stretch">
          {watchlist.length === 0 ? (
            <Text>No movies in watchlist.</Text>
          ) : (
            watchlist.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onAdd={handleAdd}
                onRemove={handleRemove}
                isInWatchlist={true}
              />
            ))
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

// --- App Entry ---
const App = () => (
  <Provider store={store}>
    <MovieApp />
  </Provider>
);

export default App;
