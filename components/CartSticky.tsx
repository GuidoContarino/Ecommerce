import React from "react";
import { Button, Stack } from "@chakra-ui/react";
import { Product } from "./product/types";

interface CartStickyProps {
  cart: Product[];
  text: string;
}

function CartSticky({ cart, text }: CartStickyProps) {
  return (
    <>
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
    </>
  );
}

export default CartSticky;
