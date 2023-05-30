import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Product } from "../product/types";
import api from "../product/api";
import { Grid, Stack, Text, Button } from "@chakra-ui/react";

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
  <Stack>
    <Grid templateColumns='repeat(auto-fill, minmax(240px,1fr))' gap={6}>
    {products.map (product => (
    <Stack key={product.id} backgroundColor="gray.100" borderRadius="md" padding={4}>
      <Text textAlign="center">{product.title}</Text>
      <Text textAlign="center" color="green.500">{parseCurrency(product.price)}</Text>
      <Button colorScheme="primary" onClick={() => setCart(cart => cart.concat (product))}>
        Agregar
      </Button>
    </Stack>
    ))}
  </Grid>
   {Boolean(cart.length) && (
   <Link isExternal href={`https://wa.me/5491131066937?text=${encodeURIComponent(text)}`}>
    <Button colorScheme="whatsapp">Completar Pedido ({cart.length} productos)</Button>
   </Link>)}
  </Stack>
);
};

export const getStaticProps: GetStaticProps = async () =>
  {
    const products = await api.list();
    return {
      props: {
        products,
      },
    };
  };
export default IndexRoute;