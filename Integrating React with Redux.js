//Integrating React with Redux
//
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, Box, Heading, Input, Button, VStack, HStack, Text, Checkbox } from '@chakra-ui/react';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';

// Action Creators
const addTodo = (title) => ({
  type: ADD_TODO,
  payload: { id: uuidv4(), title, status: false }
});

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id
});

const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: id
});

// Initial State
const initialState = {
  todos: []
};

// Reducer
const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, status: !todo.status } : todo
        )
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
};

// Store
const store = createStore(todoReducer);

// TodoApp Component
function TodoApp() {
  const [input, setInput] = useState('');
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (input.trim() !== '') {
      dispatch(addTodo(input));
      setInput('');
    }
  };

  return (
    <Box p={6} maxW="md" mx="auto">
      <Heading mb={4}>Redux Todo App</Heading>
      <HStack mb={4}>
        <Input
          placeholder="Enter todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleAdd}>Add</Button>
      </HStack>

      <VStack align="stretch" spacing={3}>
        {todos.map((todo) => (
          <HStack key={todo.id} justify="space-between" p={3} borderWidth={1} borderRadius="md">
            <Checkbox
              isChecked={todo.status}
              onChange={() => dispatch(toggleTodo(todo.id))}
            >
              <Text as={todo.status ? 's' : ''}>{todo.title}</Text>
            </Checkbox>
            <Button colorScheme="red" size="sm" onClick={() => dispatch(deleteTodo(todo.id))}>
              Delete
            </Button>
          </HStack>
        ))}
      </VStack>

      <Box mt={6}>
        <Heading size="sm">Raw State:</Heading>
        <Text mt={2} fontSize="sm" bg="gray.100" p={2} borderRadius="md">
          {JSON.stringify(todos, null, 2)}
        </Text>
      </Box>
    </Box>
  );
}

// Render App
ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <TodoApp />
    </ChakraProvider>
  </Provider>,
  document.getElementById('root')
);
