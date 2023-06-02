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
  Divider,
  Input,
  Select,
} from "@chakra-ui/react";
import styled from "styled-components";
import { Product } from "@/product/types";
import Link from "next/link";

interface Props {
  products: Product[];
}

/* Función parseCurrency toma un valor numérico 
   y lo convierte en una representación formateada de la moneda. 
   En este caso, se utiliza la localización "es-Ar" para mostrar el símbolo de la moneda en pesos argentinos. */
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
  // Estado del carrito y producto seleccionado
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Manejadores para abrir y cerrar el Drawer
  const handleOpenProductDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleCloseProductDrawer = () => {
    setIsProductDrawerOpen(false);
  };

  // Manejador para cambiar la categoría seleccionada
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Filtra los productos en función de la categoría seleccionada y el término de búsqueda
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Generación del texto para el pedido
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
      <Stack direction="row" spacing={4}>
        <Flex flex={1}>
          <Text color="white">Buscar producto:</Text>
          <Input
            placeholder="Ingrese un término de búsqueda"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Flex>
        <Flex flex={1}>
          <Text color="white">Filtrar por categoría:</Text>
          <Select
            placeholder="Todas las categorías"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {Array.from(
              new Set(products.map((product) => product.category))
            ).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Flex>
      </Stack>
      <Grid templateColumns="repeat(auto-fill, minmax(240px,1fr))" gap={6}>
        {filteredProducts.map((product) => (
          <Stack
            key={product.id}
            border="1px solid gray"
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
            <Divider />
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
            Ver Pedido ({cart.length} productos)
          </Button>
        </Stack>
      )}
      <Divider />
      <Flex justifyContent="center">
        <Text color="white">
          © Copyright 2023. Creado Por -
          <Link href="https://www.linkedin.com/in/guido-contarino/" passHref>
            Guido Contarino
          </Link>
          - para Quimica Gr
        </Text>
      </Flex>
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
