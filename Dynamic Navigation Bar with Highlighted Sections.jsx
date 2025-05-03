//Dynamic Navigation Bar with Highlighted Sections//
import React from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Stack,
  Text,
  Link as ChakraLink,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

// Individual page components
const Home = () => <Text fontSize="2xl">Welcome to Home Page</Text>;
const About = () => <Text fontSize="2xl">About Us</Text>;
const Contact = () => <Text fontSize="2xl">Contact Us</Text>;
const Services = () => <Text fontSize="2xl">Our Services</Text>;

// NavBar component
const Navbar = () => {
  // Stack vertically on mobile, horizontally on larger screens
  const direction = useBreakpointValue({ base: "column", md: "row" });

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/services", label: "Services" },
  ];

  return (
    <Box bg="gray.100" p={4}>
      <Flex justify="center">
        <Stack direction={direction} spacing={4} align="center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              style={({ isActive }) => ({
                color: isActive ? "blue" : "black",
                textDecoration: "none",
              })}
            >
              {({ isActive }) => (
                <ChakraLink
                  _hover={{ color: "blue.500" }}
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {item.label}
                </ChakraLink>
              )}
            </NavLink>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
};

// Main App
const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Box p={6}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
