import { useState, useMemo, useEffect } from "react";
import React from "react";
import { GetStaticProps } from "next";
import { Grid, Stack, Text, Flex, Divider, Button } from "@chakra-ui/react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import ProductDrawer from "../components/ProductDrawer";
import { parseCurrency } from "../components/utils";
import api from "@/product/api";
import { Product } from "../product/types";
import ProductFiltres from "../components/ProductFiltres";
import { BsFillArrowDownCircleFill } from "react-icons/bs";

interface Props {
  products: Product[];
}

interface CategoryState {
  category: string;
  isOpen: boolean;
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryStates, setCategoryStates] = useState<CategoryState[]>([]);

  // Initialize the category states based on the unique categories in products
  useEffect(() => {
    const categories = Array.from(
      new Set(products.map((product) => product.category))
    );
    const initialCategoryStates = categories.map((category) => ({
      category,
      isOpen: true, // By default, all categories are open
    }));
    setCategoryStates(initialCategoryStates);
  }, [products]);

  const handleOpenProductDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleCloseProductDrawer = () => {
    setIsProductDrawerOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowProducts(true);
  };

  const handleToggleProducts = (category: string) => {
    setCategoryStates((prevStates) => {
      const updatedStates = prevStates.map((state) =>
        state.category === category
          ? { ...state, isOpen: !state.isOpen }
          : state
      );
      return updatedStates;
    });
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

  const text = useMemo(
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

      {categories.map((category) => {
        const categoryProducts = filteredProducts.filter(
          (product) => product.category === category
        );

        const categoryState = categoryStates.find(
          (state) => state.category === category
        );

        if (categoryProducts.length > 0) {
          return (
            <Stack key={category}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xl" fontWeight="bold" color="white">
                  {category} ({categoryProducts.length})
                </Text>
                <BsFillArrowDownCircleFill
                  onClick={() => handleToggleProducts(category)}
                  color="white"
                  size="1.5rem"
                  cursor="pointer"
                ></BsFillArrowDownCircleFill>
              </Flex>
              {categoryState?.isOpen && (
                <Grid
                  templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
                  gap={6}
                >
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleOpenProductDrawer(product)}
                    />
                  ))}
                </Grid>
              )}
            </Stack>
          );
        }

        return null;
      })}

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
        <Text color="white" textAlign="center">
          © 2023. Creado Por -
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
