import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
  Divider,
  Button,
  Spacer,
  DrawerFooter,
  Badge,
  Container,
} from "@chakra-ui/react";
import { Product } from "@/components/product/types";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (quantity: number) => void;
  cartQuantity: number;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  cartQuantity,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      const newTotalPrice = product.price * quantity;
      setTotalPrice(newTotalPrice);
    }
  }, [product, quantity]);

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  return (
    <Drawer size="md" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent backgroundColor="black" border="2px solid rgb(29 40 58)">
        <DrawerCloseButton
          color="white"
          backgroundColor="black"
          borderRadius="md"
          border="2px solid rgb(29 40 58)"
          width="4rem"
          height="4rem"
        />
        <DrawerHeader>
          <Flex align="center" margin={1.5}>
            <AiOutlineShoppingCart size="3rem" color="white" />
            <Badge
              backgroundColor="black"
              color="white"
              fontSize="xl"
              marginLeft={2}
              borderRadius="full"
              paddingX={2}
              paddingY={1}
            >
              {cartQuantity}
            </Badge>
          </Flex>
          <Image
            width="100%"
            borderRadius="md"
            margin={0}
            objectFit="contain"
            src={product?.image}
            alt={product?.title}
          />
          <Text fontSize="2xl" color="white" margin={2}>
            {product?.title}
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Text fontSize="xl" margin={3} marginTop={2} color="gray.400">
            {product?.description}
          </Text>

          <Flex alignItems="center" marginTop={4}>
            <Text fontSize="xl" margin={3} color="white">
              Cantidad:
            </Text>
            <Button
              colorScheme="blue"
              borderRadius={999}
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Text fontSize="xl" margin={3} color="white">
              {quantity}
            </Text>
            <Button
              colorScheme="blue"
              borderRadius={999}
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </Button>
          </Flex>
          <Divider />
          <Flex>
            <Text fontSize="xl" margin={3} color="white">
              Total
            </Text>
            <Spacer />
            <Text fontSize="xl" margin={3} color="white">
              $ {totalPrice.toLocaleString()}
            </Text>
          </Flex>
        </DrawerBody>
        <DrawerFooter>
          <Button
            backgroundColor="white"
            width="100%"
            bottom="0"
            border="2px solid rgb(29 40 58)"
            size="sm"
            onClick={handleAddToCart}
          >
            Agregar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDrawer;
