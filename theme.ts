import { extendTheme, theme } from "@chakra-ui/react";

export default extendTheme({
    colors: {
        primary: theme.colors["black"],
    },
    styles:{
        global:{
            body:{
                backgroundColor:"primary",
            },
        }
    }
})