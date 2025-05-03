//Debugging: Fix Multi-Level Dynamic Routing//
import React from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";

// Dummy user data
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// Users page component
const Users = () => {
  return (
    <VStack spacing={4} align="start">
      <Heading size="lg">Users Page</Heading>
      {users.map((user) => (
        <Text key={user.id}>
          <ChakraLink
            as={Link}
            to={`/users/${user.id}`}
            _hover={{ color: "blue.500" }}
          >
            {user.name}
          </ChakraLink>
        </Text>
      ))}
    </VStack>
  );
};

// User details page component
const UserDetails = () => {
  const { id } = useParams();
  const user = users.find((u) => u.id === parseInt(id));

  return (
    <Box>
      <Heading size="lg">User Details</Heading>
      {user ? (
        <Text fontSize="xl">Details for {user.name}</Text>
      ) : (
        <Text color="red.500">User not found.</Text>
      )}
    </Box>
  );
};

// Main App component
const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Box p={6}>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
