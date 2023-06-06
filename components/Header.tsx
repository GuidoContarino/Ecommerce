import React from "react";
import { VStack, Heading, Text, Flex, Divider, Image } from "@chakra-ui/react";
import Link from "next/link";
import { AiFillInstagram, AiOutlineWhatsApp } from "react-icons/ai";

export const Header: React.FC = () => (
  <>
    <VStack marginBottom={6}>
      <Image height={150} borderRadius={9999} src="../assets/image.png" />
      <Heading color="white">Quimica Gr</Heading>
      <Text color="white" textAlign="center">
        Venta de Productos de Limpieza y Belleza Corporal Online
      </Text>
      <Flex gap={3}>
        <Link href="https://www.instagram.com/grquimica/">
          <AiFillInstagram size="3rem" color="white" />
        </Link>
        <Link href="https://wa.me/5491130429802">
          <AiOutlineWhatsApp size="3rem" color="white" />
        </Link>
      </Flex>
    </VStack>
    <Divider marginY={6} />
  </>
);
