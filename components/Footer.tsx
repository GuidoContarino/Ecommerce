import React from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

const Footer: React.FC = () => (
  <>
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
  </>
);

export default Footer;
