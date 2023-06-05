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
import { IoIosArrowDown } from "react-icons/io";

interface Props {
  products: Product[]; // Propiedad que representa la lista de productos
}

interface CategoryState {
  category: string; // Nombre de la categoría
  isOpen: boolean; // Indica si la categoría está abierta o cerrada en el filtro
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]); // Estado que representa el carrito de compras
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Estado que representa el producto seleccionado en el cajón de productos
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false); // Estado que indica si el cajón de productos está abierto o cerrado
  const [searchTerm, setSearchTerm] = useState(""); // Estado que almacena el término de búsqueda para filtrar los productos
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Estado que almacena la categoría seleccionada para filtrar los productos
  const [categoryStates, setCategoryStates] = useState<CategoryState[]>([]); // Estado que almacena la información de cada categoría
  const [cartQuantity, setCartQuantity] = useState<number>(0); // Estado que almacena la cantidad de productos en el carrito

  // Inicializa el estado de las categorías basado en las categorías únicas de los productos
  useEffect(() => {
    const categories = Array.from(
      new Set(products.map((product) => product.category))
    ); // Obtiene las categorías únicas de los productos
    const initialCategoryStates = categories.map((category) => ({
      category,
      isOpen: true, // Por defecto, todas las categorías están abiertas
    }));
    setCategoryStates(initialCategoryStates);
  }, [products]);

  // Función que se llama al abrir el cajón de productos
  const handleOpenProductDrawer = (product: Product) => {
    setSelectedProduct(product); // Establece el producto seleccionado
    setIsProductDrawerOpen(true); // Abre el cajón de productos
  };

  // Función que se llama al cerrar el cajón de productos
  const handleCloseProductDrawer = () => {
    setIsProductDrawerOpen(false); // Cierra el cajón de productos
  };

  // Función que se llama al cambiar la categoría seleccionada en el filtro
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); // Actualiza la categoría seleccionada
  };

  // Función que se llama al hacer clic en una categoría para abrir o cerrar la sección de productos correspondiente
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

  // Función que se llama al agregar un producto al carrito
  const handleAddToCart = (quantity: number) => {
    if (selectedProduct) {
      const productWithQuantity = {
        ...selectedProduct,
        quantity: quantity,
      };
      setCart((cart) => [...cart, productWithQuantity]); // Agrega el producto al carrito
      setCartQuantity(quantity); // Actualiza la cantidad de productos en el carrito
    }
  };

  // Filtra los productos según la categoría seleccionada y el término de búsqueda
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

  // Obtiene la lista de categorías únicas de los productos
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );

  // Genera el texto del pedido
  const text = useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(
              `* ${product.title} - ${parseCurrency(product.price)} (${
                product.quantity
              } unidades)\n`
            ),
          ``
        )
        .concat(
          `\nTotal: ${parseCurrency(
            cart.reduce(
              (total, product) => total + product.price * product.quantity,
              0
            )
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
                <IoIosArrowDown
                  onClick={() => handleToggleProducts(category)}
                  color="white"
                  size="1.5rem"
                  cursor="pointer"
                ></IoIosArrowDown>
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
        onAddToCart={handleAddToCart}
      />

      {Boolean(cart.length) && (
        <Stack
          position="sticky"
          bottom={4}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            as="a"
            width="fit-content"
            colorScheme="whatsapp"
            href={`https://wa.me/5491131066937?text=QuimicaGr-Pedido:${encodeURIComponent(
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
  const products = await api.list(); // Obtiene la lista de productos utilizando la función `list` de la API

  return {
    revalidate: 10, // Indica que esta página debe ser regenerada cada 10 segundos
    props: {
      products, // Proporciona los productos como propiedades al componente `IndexRoute`
    },
  };
};

export default IndexRoute;
