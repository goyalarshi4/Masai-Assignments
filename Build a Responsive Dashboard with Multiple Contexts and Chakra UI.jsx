//Build a Responsive Dashboard with Multiple Contexts and Chakra UI//
import React, { createContext, useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  Box,
  Flex,
  Grid,
  Button,
  Text,
  useMediaQuery,
  Stack,
} from "@chakra-ui/react";

// ======= AuthContext =========
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn((prev) => !prev);
  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// ======= ThemeContext =========
const ThemeContext = createContext();

const ThemeProviderCustom = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ======= App Component =========
const App = () => {
  const { isLoggedIn, toggleAuth } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  const bg = theme === "light" ? "gray.100" : "gray.700";
  const cardBg = theme === "light" ? "white" : "gray.600";
  const textColor = theme === "light" ? "black" : "white";
  const footerBg = theme === "light" ? "gray.300" : "gray.800";
  const sidebarBg = theme === "light" ? "gray.200" : "gray.900";

  const products = ["Product 1", "Product 2", "Product 3", "Product 4"];

  return (
    <Box minH="100vh" bg={bg} color={textColor}>
      {/* Navbar */}
      <Flex
        p="4"
        justifyContent="space-between"
        align="center"
        bg={bg}
        boxShadow="md"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Text>{isLoggedIn ? "Logged In" : "Logged Out"}</Text>
        <Stack direction="row" spacing={4}>
          <Button size="sm" onClick={toggleAuth}>
            {isLoggedIn ? "Log Out" : "Log In"}
          </Button>
          <Button size="sm" onClick={toggleTheme}>
            Toggle {theme === "light" ? "Dark" : "Light"}
          </Button>
        </Stack>
      </Flex>

      {/* Body: Sidebar + Main */}
      <Flex direction={{ base: "column", md: "row" }} p="4" gap="4">
        {/* Sidebar */}
        <Box
          flex={{ base: "0", md: "0 0 200px" }}
          bg={sidebarBg}
          borderRadius="md"
          p="4"
          display={isSmallerThan768 ? "none" : "block"}
          minW="200px"
        >
          {isLoggedIn ? (
            <Text fontWeight="bold">Welcome, User!</Text>
          ) : (
            <Text>Please log in to see content.</Text>
          )}
        </Box>

        {/* Main Content */}
        <Box flex="1">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap="4"
          >
            {products.map((product, index) => (
              <Box
                key={index}
                p="4"
                bg={cardBg}
                borderRadius="md"
                boxShadow="sm"
                textAlign="center"
              >
                {product}
              </Box>
            ))}
          </Grid>
        </Box>
      </Flex>

      {/* Footer */}
      <Box
        as="footer"
        p="4"
        textAlign="center"
        bg={footerBg}
        mt="auto"
        position="sticky"
        bottom="0"
      >
        Dashboard Footer - Theme: {theme}
      </Box>
    </Box>
  );
};

// ======= Render Entire App =========
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <ThemeProviderCustom>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProviderCustom>
  </ChakraProvider>
);
