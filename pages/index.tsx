import React, { useState, useMemo, useEffect } from "react";
import { GetStaticProps } from "next";
import { Stack } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryList from "../components/CategoryList";
import ProductDrawer from "../components/ProductDrawer";
import { parseCurrency } from "../components/utils";
import api from "@/components/product/api";
import { Product } from "../components/product/types";
import ProductFiltres from "../components/ProductFiltres";
import CartSticky from "../components/CartSticky";
import Footer from "../components/Footer";

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
  const [cartQuantity, setCartQuantity] = useState<number>(0);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: "",
  });

  // Inicializa el estado de las categorías basado en las categorías únicas de los productos
  useEffect(() => {
    const categories = Array.from(
      new Set(products.map((product) => product.category))
    );
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
      setCartQuantity((prevQuantity) => prevQuantity + quantity); // Actualiza la cantidad de productos en el carrito

      // Muestra la notificación
      toast.success(`Producto agregado al carrito: ${selectedProduct.title}`, {
        autoClose: 3000,
      });
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
        cartQuantity={cartQuantity}
      />
      <CartSticky cartQuantity={cartQuantity} text={text} />
      <Footer />
      {notification.show && <div>{notification.message}</div>}
      <ToastContainer position="top-right" />
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
