import React from "react";
import { ChakraProvider, Container, Box } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { AppProps } from "next/app";
import theme from "../theme";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4} backgroundColor="black">
        <Container
          backgroundColor="black"
          borderRadius="sm"
          boxShadow="md"
          marginY={4}
          maxWidth="container.xl"
          padding={4}
        >
          <Header />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
