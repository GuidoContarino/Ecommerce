import React from "react";
import { useState, useMemo, useEffect } from "react";
import { GetStaticProps } from "next";
import { Stack } from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
import ProductDrawer from "../components/ProductDrawer";
import { parseCurrency } from "../components/utils";
import api from "@/components/product/api";
import { Product } from "../components/product/types";
import ProductFiltres from "../components/ProductFiltres";
import CartSticky from "../components/CartSticky";
import Footer from "../components/Footer";

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
      <CategoryList
        categories={categories}
        filteredProducts={filteredProducts}
        categoryStates={categoryStates}
        handleToggleProducts={handleToggleProducts}
        handleOpenProductDrawer={handleOpenProductDrawer}
      />
      <ProductDrawer
        isOpen={isProductDrawerOpen}
        onClose={handleCloseProductDrawer}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
      <CartSticky cart={cart} text={text} />
      <Footer />
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
