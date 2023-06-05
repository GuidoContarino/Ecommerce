import React from "react";
import Link from "next/link";
import {
  ChakraProvider,
  Container,
  VStack,
  Image,
  Heading,
  Text,
  Box,
  Divider,
  Flex,
} from "@chakra-ui/react";
import Head from "next/head";
import { AiFillInstagram, AiOutlineWhatsApp } from "react-icons/ai";
import { AppProps } from "next/app";
import theme from "../theme";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Quimica Gr</title>
      </Head>
      <Box padding={4} backgroundColor="black">
        <Container
          backgroundColor="black"
          borderRadius="sm"
          boxShadow="md"
          marginY={4}
          maxWidth="container.xl"
          padding={4}
        >
          <VStack marginBottom={6}>
            <Image height={150} borderRadius={9999} src="../assets/image.png" />
            <Heading color="white">Quimica Gr</Heading>
            <Text color="white" textAlign="center">
              Venta de Productos de Limpieza y Belleza Corporal Online
            </Text>
            <Flex gap={3}>
              <Link href="https://www.instagram.com/grquimica/">
                <AiFillInstagram size="3rem" color="white" />
              </Link>
              <Link href="https://wa.me/5491130429802">
                <AiOutlineWhatsApp size="3rem" color="white" />
              </Link>
            </Flex>
          </VStack>
          <Divider marginY={6} />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
