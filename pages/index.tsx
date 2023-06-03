import { useState, useMemo } from "react";
import React from "react";
import { GetStaticProps } from "next";
import { Button, Grid, Stack, Text, Flex, Divider } from "@chakra-ui/react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import ProductDrawer from "../components/ProductDrawer";
import { parseCurrency } from "../components/utils";
import api from "@/product/api";
import { Product } from "../product/types";
import ProductFiltres from "../components/ProductFiltres";

interface Props {
  products: Product[];
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenProductDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleCloseProductDrawer = () => {
    setIsProductDrawerOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );
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
      <ProductFiltres
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchTermChange={setSearchTerm}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />
      <Grid templateColumns="repeat(auto-fill, minmax(240px,1fr))" gap={6}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleOpenProductDrawer(product)}
          />
        ))}
      </Grid>
      <ProductDrawer
        isOpen={isProductDrawerOpen}
        onClose={handleCloseProductDrawer}
        product={selectedProduct}
        onAddToCart={() => {
          if (selectedProduct) {
            setCart((cart) => [...cart, selectedProduct]);
          }
        }}
      />
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
