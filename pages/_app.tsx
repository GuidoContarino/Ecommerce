import React from 'react'
import { ChakraProvider, Container, VStack, Image, Heading, Text, Box, Divider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import theme from '../theme'
const App: React.FC<AppProps> = ({Component , pageProps}) =>{
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
      <Container backgroundColor="white"
      borderRadius="sm"
      boxShadow="md"
      marginY={4}
      maxWidth="container.xl"
      padding={4}
      >
        <VStack marginBottom={6}>
          <Image borderRadius={9999} src='//placehold.it/128x128'/>
          <Heading>Quimica Gr</Heading>
          <Text>Venta de Productos de Limpieza y Belleza Corporal Online</Text>
        </VStack>
        <Divider marginY={6}/>
        <Component {...pageProps}/>
      </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App;