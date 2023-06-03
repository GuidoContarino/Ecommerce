import React from "react";
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
} from "@chakra-ui/react";
import { Product } from "@/product/types";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: () => void;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
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
          <Image
            width="100%"
            borderRadius="md"
            margin={0}
            objectFit="contain"
            src={product?.image}
            alt={product?.title}
          />
        </DrawerHeader>
        <DrawerBody>
          <Text fontSize="2xl" margin={4} color="white">
            {product?.title}
          </Text>
          <Text fontSize="xl" margin={4} marginTop={5} color="gray.400">
            {product?.description}
          </Text>
          <Divider />
          <Flex>
            <Text fontSize="xl" margin={4} color="white">
              Total
            </Text>
            <Spacer />
            <Text fontSize="xl" margin={4} color="white">
              $ {product?.price}
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
            onClick={onAddToCart}
          >
            Agregar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDrawer;
