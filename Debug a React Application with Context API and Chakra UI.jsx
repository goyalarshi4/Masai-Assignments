//Debug a React Application with Context API and Chakra UI

//
// index.js (Full Application in One File)
import React, { useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  Box,
  Flex,
  Grid,
  Button,
  extendTheme,
} from "@chakra-ui/react";

// ====================== AuthContext ======================
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn((prev) => !prev);
  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// ====================== ThemeContext ======================
const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ====================== App Component ======================
function App() {
  const { isLoggedIn, toggleAuth } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const bgColor = theme === "light" ? "gray.100" : "gray.700";
  const cardBg = theme === "light" ? "gray.200" : "gray.600";
  const footerBg = theme === "light" ? "gray.300" : "gray.800";
  const textColor = theme === "light" ? "black" : "white";

  return (
    <Box minH="100vh" bg={bgColor} color={textColor}>
      {/* Navbar */}
      <Flex
        as="nav"
        p="4"
        justifyContent="space-between"
        bg={bgColor}
        boxShadow="md"
      >
        <Button onClick={toggleAuth}>
          {isLoggedIn ? "Log Out" : "Log In"}
        </Button>
        <Button onClick={toggleTheme}>
          Toggle to {theme === "light" ? "Dark" : "Light"} Theme
        </Button>
      </Flex>

      {/* Grid of Cards */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap="4"
        p="4"
      >
        {["Card 1", "Card 2", "Card 3"].map((card) => (
          <Box
            key={card}
            p="4"
            shadow="md"
            bg={cardBg}
            borderRadius="md"
            textAlign="center"
          >
            {card}
          </Box>
        ))}
      </Grid>

      {/* Footer */}
      <Box as="footer" p="4" bg={footerBg} textAlign="center">
        {isLoggedIn ? "Welcome, User" : "Please log in"}
      </Box>
    </Box>
  );
}

// ====================== Render Application ======================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <ThemeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeContextProvider>
  </ChakraProvider>
);
