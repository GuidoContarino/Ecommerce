import { useState } from "react";
import React from "react";
import api from "@/product/api";
import { GetStaticProps } from "next";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerFooter,
  Grid,
  Image,
  Stack,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import styled from "styled-components";
import { Product } from "@/product/types";

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-Ar", {
    style: "currency",
    currency: "ARS",
  });
}

const StyledDrawer = styled(Drawer)`
  .chakra-drawer__content {
    background-color: white;
  }
`;

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);

  const handleOpenProductDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleCloseProductDrawer = () => {
    setIsProductDrawerOpen(false);
  };

  const text = React.useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(
              `* ${product.title} - ${parseCurrency(product.price)}\n`
            ),
          ``
        )
        .concat(
          `\nTotal: ${parseCurrency(
            cart.reduce((total, product) => total + product.price, 0)
          )}`
        ),
    [cart]
  );

  return (
    <Stack spacing={6}>
      <Grid templateColumns="repeat(auto-fill, minmax(240px,1fr))" gap={6}>
        {products.map((product) => (
          <Stack
            key={product.id}
            border="1px solid white"
            spacing={3}
            backgroundColor="black"
            borderRadius="md"
            padding={4}
            onClick={() => handleOpenProductDrawer(product)}
            cursor="pointer"
          >
            <Image
              maxHeight="unset"
              objectFit="contain"
              borderRadius="md"
              src={product.image}
              alt={product.title}
            />
            <Stack spacing={1}>
              <Text textAlign="center" color="white">
                {product.title}
              </Text>
              <Text color="white" textAlign="center" fontSize={13}>
                {product.description}
              </Text>
              <Text textAlign="center" color="blue.600">
                {parseCurrency(product.price)}
              </Text>
            </Stack>
          </Stack>
        ))}
      </Grid>
      <StyledDrawer
        size="md"
        placement="right"
        isOpen={isProductDrawerOpen}
        onClose={handleCloseProductDrawer}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="black">
          <DrawerCloseButton
            color="white"
            backgroundColor="black"
            borderRadius="md"
            border="2px solid gray"
            width="4rem"
            height="4rem"
          />
          <DrawerHeader>
            <Image
              width="100%"
              borderRadius="md"
              margin={0}
              objectFit="contain"
              src={selectedProduct?.image}
              alt={selectedProduct?.title}
            />
          </DrawerHeader>
          <DrawerBody>
            <Text fontSize="2xl" margin={4} color="white">
              {selectedProduct?.title}
            </Text>
            <Text fontSize="xl" margin={4} marginTop={5} color="gray.400">
              {selectedProduct?.description}
            </Text>
            <Flex>
              <Text fontSize="xl" margin={4} color="white">
                Total
              </Text>
              <Spacer />
              <Text fontSize="xl" margin={4} color="white">
                $ {selectedProduct?.price}
              </Text>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Button
              backgroundColor="white"
              width="100%"
              bottom="0"
              border="2px solid blue"
              size="sm"
              onClick={() => {
                setCart((cart) => cart.concat(selectedProduct));
              }}
            >
              Agregar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </StyledDrawer>
      {Boolean(cart.length) && (
        <Stack
          position="sticky"
          bottom={1}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            as="a"
            width="fit-content"
            colorScheme="whatsapp"
            href={`https://wa.me/5491130429802?text=QuimicaGr-Pedido:${encodeURIComponent(
              text
            )}`}
          >
            Completar Pedido ({cart.length} productos)
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default IndexRoute;
