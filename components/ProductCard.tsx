import React from "react";
import { Stack, Image, Text } from "@chakra-ui/react";
import { Product } from "@/components/product/types";
import { parseCurrency } from "./utils";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <Stack
      key={product.id}
      border="2px solid rgb(29 40 58)"
      spacing={3}
      backgroundColor="black"
      borderRadius="md"
      padding={4}
      onClick={onClick}
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
  );
};

export default ProductCard;
