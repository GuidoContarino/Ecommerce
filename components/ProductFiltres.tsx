import { Grid, Flex, Input, Select } from "@chakra-ui/react";

interface Props {
  searchTerm: string;
  selectedCategory: string | null;
  onSearchTermChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const ProductFilters: React.FC<Props> = ({
  searchTerm,
  selectedCategory,
  onSearchTermChange,
  onCategoryChange,
  categories,
}) => {
  return (
    <Grid
      templateColumns={{ sm: "1fr", md: "1fr 1fr" }}
      gap={6}
      alignItems="center"
    >
      <Flex>
        <Input
          color="gray"
          borderColor="rgb(29 40 58)"
          placeholder="Buscar ..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </Flex>
      <Flex>
        <Select
          placeholder="Todas las Categorias"
          color="gray"
          borderColor="rgb(29 40 58)"
          value={selectedCategory || undefined}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Flex>
    </Grid>
  );
};

export default ProductFilters;
