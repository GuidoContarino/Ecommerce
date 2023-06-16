import React from "react";
import { Button, Stack } from "@chakra-ui/react";

interface CartStickyProps {
  cartQuantity: number;
  text: string;
}

const CartSticky: React.FC<CartStickyProps> = ({ cartQuantity, text }) => {
  return (
    <>
      {cartQuantity > 0 && (
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
            Completar Pedido ({cartQuantity} productos)
          </Button>
        </Stack>
      )}
    </>
  );
};

export default CartSticky;
