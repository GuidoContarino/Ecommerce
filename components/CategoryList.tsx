import React from "react";
import { Stack, Flex, Text, Grid } from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";
import ProductCard from "./ProductCard";

const CategoryList = ({
  categories,
  filteredProducts,
  categoryStates,
  handleToggleProducts,
  handleOpenProductDrawer,
}) => {
  return (
    <>
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
    </>
  );
};

export default CategoryList;
