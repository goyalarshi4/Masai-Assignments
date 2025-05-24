import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  Text,
  Checkbox,
  SimpleGrid
} from '@chakra-ui/react';
import { createStore, combineReducers } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// ACTION TYPES
const ADD_BOOK = 'ADD_BOOK';
const DELETE_BOOK = 'DELETE_BOOK';
const TOGGLE_READ = 'TOGGLE_READ';
const EDIT_BOOK = 'EDIT_BOOK';
const SET_FILTER = 'SET_FILTER';

// ACTIONS
const addBook = (book) => ({ type: ADD_BOOK, payload: { ...book, id: uuidv4(), read: false } });
const deleteBook = (id) => ({ type: DELETE_BOOK, payload: id });
const toggleRead = (id) => ({ type: TOGGLE_READ, payload: id });
const editBook = (book) => ({ type: EDIT_BOOK, payload: book });
const setFilter = (filter) => ({ type: SET_FILTER, payload: filter });

// BOOK REDUCER
const bookInitialState = [];
const bookReducer = (state = bookInitialState, action) => {
  switch (action.type) {
    case ADD_BOOK:
      return [...state, action.payload];
    case DELETE_BOOK:
      return state.filter(book => book.id !== action.payload);
    case TOGGLE_READ:
      return state.map(book =>
        book.id === action.payload ? { ...book, read: !book.read } : book
      );
    case EDIT_BOOK:
      return state.map(book =>
        book.id === action.payload.id ? { ...book, ...action.payload } : book
      );
    default:
      return state;
  }
};

// FILTER REDUCER
const filterReducer = (state = { status: 'ALL', genre: '', author: '' }, action) => {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// COMBINED REDUCERS
const rootReducer = combineReducers({
  books: bookReducer,
  filters: filterReducer
});

const store = createStore(rootReducer);

// COMPONENTS
function BookForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const handleAdd = () => {
    if (title && author && genre) {
      dispatch(addBook({ title, author, genre }));
      setTitle('');
      setAuthor('');
      setGenre('');
    }
  };

  return (
    <VStack spacing={3}>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <Input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <Button colorScheme="teal" onClick={handleAdd}>Add Book</Button>
    </VStack>
  );
}

function FilterControls() {
  const dispatch = useDispatch();
  return (
    <HStack spacing={4} mt={4}>
      <Select onChange={(e) => dispatch(setFilter({ status: e.target.value }))}>
        <option value="ALL">All</option>
        <option value="READ">Read</option>
        <option value="UNREAD">Unread</option>
      </Select>
      <Input
        placeholder="Filter by Author"
        onChange={(e) => dispatch(setFilter({ author: e.target.value }))}
      />
      <Input
        placeholder="Filter by Genre"
        onChange={(e) => dispatch(setFilter({ genre: e.target.value }))}
      />
    </HStack>
  );
}

function BookList() {
  const books = useSelector((state) => state.books);
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const filteredBooks = books.filter((book) => {
    const byStatus =
      filters.status === 'ALL' ||
      (filters.status === 'READ' && book.read) ||
      (filters.status === 'UNREAD' && !book.read);

    const byAuthor = filters.author === '' || book.author.toLowerCase().includes(filters.author.toLowerCase());
    const byGenre = filters.genre === '' || book.genre.toLowerCase().includes(filters.genre.toLowerCase());

    return byStatus && byAuthor && byGenre;
  });

  const handleEdit = (book) => {
    setEditId(book.id);
    setEditFields(book);
  };

  const handleSave = () => {
    dispatch(editBook(editFields));
    setEditId(null);
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
      {filteredBooks.map((book) => (
        <Box key={book.id} borderWidth="1px" borderRadius="lg" p={4}>
          {editId === book.id ? (
            <VStack>
              <Input value={editFields.title} onChange={(e) => setEditFields({ ...editFields, title: e.target.value })} />
              <Input value={editFields.author} onChange={(e) => setEditFields({ ...editFields, author: e.target.value })} />
              <Input value={editFields.genre} onChange={(e) => setEditFields({ ...editFields, genre: e.target.value })} />
              <Button size="sm" colorScheme="green" onClick={handleSave}>Save</Button>
            </VStack>
          ) : (
            <>
              <Text><strong>Title:</strong> {book.title}</Text>
              <Text><strong>Author:</strong> {book.author}</Text>
              <Text><strong>Genre:</strong> {book.genre}</Text>
              <Checkbox isChecked={book.read} onChange={() => dispatch(toggleRead(book.id))}>
                {book.read ? 'Read' : 'Unread'}
              </Checkbox>
              <HStack mt={2}>
                <Button size="sm" colorScheme="blue" onClick={() => handleEdit(book)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => dispatch(deleteBook(book.id))}>Delete</Button>
              </HStack>
            </>
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
}

function App() {
  return (
    <Box p={6}>
      <Heading mb={4}>📚 Redux Book Library</Heading>
      <BookForm />
      <FilterControls />
      <BookList />
    </Box>
  );
}

// RENDER
ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>,
  document.getElementById('root')
);
