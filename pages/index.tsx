import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Product } from "../product/types";
import api from "../product/api";
import { Grid, Stack, Text, Button, Flex, Image } from "@chakra-ui/react";

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString('es-Ar', {
    style: 'currency',
    currency: 'ARS',
  })
}

const IndexRoute: React.FC<Props> = ({products}) => {
const [cart, setCart] = React.useState<Product[]>([]);

const text = React.useMemo(() => cart
  .reduce((message, product)=> message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`), ``,)
  .concat(`\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`), [cart]);

  
return (
  <Stack spacing={6}>
    <Grid templateColumns='repeat(auto-fill, minmax(240px,1fr))' gap={6}>
    {products.map (product => (
    <Stack 
    key={product.id} 
    border="1px solid white"
    spacing={3} 
    backgroundColor="black" 
    borderRadius="md" 
    padding={4}>
      <Image 
        maxHeight="unset"
        objectFit="contain"
        borderRadius="md" 
        src={product.image}/>
        alt={product.title}
      <Stack spacing={1}>
       <Text textAlign="center" color="white">{product.title}</Text>
       <Text color="white" textAlign="center" fontSize={13}>{product.description}</Text>
       <Text textAlign="center" color="blue.600">{parseCurrency(product.price)}</Text>
      </Stack>
      <Button 
      colorScheme="blue" 
      size="sm"
      onClick={() => setCart(cart => cart.concat (product))}
      >
        Agregar
      </Button>
    </Stack>
    ))}
  </Grid>
   {Boolean(cart.length) && (
    <Flex 
    position="sticky" 
    bottom={1}
    alignItems="center"
    justifyContent="center" 
    >
      <Button 
      as={Link}
      isExternal
      width="fit-content"
      colorScheme="whatsapp"
      href={`https://wa.me/5491130429802?text=QuimicaGr:${encodeURIComponent(text)}`}>
      Completar Pedido ({cart.length} productos)
      </Button>
    </Flex>
    )}
  </Stack>
);
};

export const getStaticProps: GetStaticProps = async () =>
  {
    const products = await api.list();
    return {
      revalidate:10,
      props: {
        products,
      },
    };
  };
export default IndexRoute;