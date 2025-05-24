//Football Matches App with Redux
//
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  ChakraProvider, Box, Heading, Input, Spinner, Text, Button,
  VStack, HStack, Tag, Select, SimpleGrid
} from '@chakra-ui/react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';

// ---------- Initial State ----------
const initialState = {
  isLoading: false,
  isError: false,
  footballMatches: [],
  favorites: [],
};

// ---------- Action Types ----------
const FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST';
const FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS';
const FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

// ---------- Actions ----------
const fetchMatches = () => async (dispatch) => {
  dispatch({ type: FETCH_MATCHES_REQUEST });
  try {
    const res = await axios.get('https://jsonmock.hackerrank.com/api/football_matches?page=2');
    dispatch({ type: FETCH_MATCHES_SUCCESS, payload: res.data.data });
  } catch (err) {
    dispatch({ type: FETCH_MATCHES_FAILURE });
  }
};

const toggleFavorite = (match) => ({
  type: TOGGLE_FAVORITE,
  payload: match,
});

// ---------- Reducer ----------
function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MATCHES_REQUEST:
      return { ...state, isLoading: true, isError: false };
    case FETCH_MATCHES_SUCCESS:
      return { ...state, isLoading: false, footballMatches: action.payload };
    case FETCH_MATCHES_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case TOGGLE_FAVORITE:
      const exists = state.favorites.find((m) => m.id === action.payload.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((m) => m.id !== action.payload.id)
          : [...state.favorites, action.payload],
      };
    default:
      return state;
  }
}

// ---------- Store ----------
const store = createStore(reducer, applyMiddleware(thunk));

// ---------- Components ----------

const MatchCard = ({ match, isFavorite, onToggle }) => (
  <Box borderWidth="1px" p={4} borderRadius="md" bg={isFavorite ? 'yellow.50' : 'white'}>
    <Text fontWeight="bold">
      {match.team1} vs {match.team2}
    </Text>
    <Text>Date: {match.date}</Text>
    <Text>Venue: {match.venue}</Text>
    <Text>Winner: {match.winner}</Text>
    <Button size="sm" mt={2} onClick={() => onToggle(match)}>
      {isFavorite ? 'Unfavorite' : 'Favorite'}
    </Button>
  </Box>
);

const MatchList = () => {
  const dispatch = useDispatch();
  const { footballMatches, isLoading, isError, favorites } = useSelector((state) => state);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const filteredMatches = footballMatches.filter((match) => {
    const searchMatch =
      match.team1.toLowerCase().includes(search.toLowerCase()) ||
      match.team2.toLowerCase().includes(search.toLowerCase()) ||
      match.venue.toLowerCase().includes(search.toLowerCase()) ||
      match.date.includes(search);
    const teamMatch =
      teamFilter === 'ALL' ||
      match.team1 === teamFilter ||
      match.team2 === teamFilter;
    return searchMatch && teamMatch;
  });

  const teams = [...new Set(footballMatches.flatMap((m) => [m.team1, m.team2]))];

  if (isLoading) return <Spinner />;
  if (isError) return <Text color="red.500">Error fetching matches.</Text>;

  return (
    <Box>
      <HStack mb={4}>
        <Input
          placeholder="Search by team, venue or date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onChange={(e) => setTeamFilter(e.target.value)}>
          <option value="ALL">All Teams</option>
          {teams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {filteredMatches.map((match, i) => (
          <MatchCard
            key={i}
            match={match}
            isFavorite={favorites.some((fav) => fav.id === match.id)}
            onToggle={(m) => dispatch(toggleFavorite(m))}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

const FavoriteMatches = () => {
  const favorites = useSelector((state) => state.favorites);

  if (!favorites.length) return null;

  return (
    <Box mt={6}>
      <Heading size="md">⭐ Favorite Matches</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={2}>
        {favorites.map((match, i) => (
          <MatchCard key={i} match={match} isFavorite={true} onToggle={() => {}} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

const App = () => (
  <Box p={6}>
    <Heading mb={4}>🏆 Football Matches Tracker</Heading>
    <MatchList />
    <FavoriteMatches />
  </Box>
);

// ---------- Render ----------
ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>,
  document.getElementById('root')
);
