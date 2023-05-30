import axios from "axios";
import { Product } from "./types";
import Papa from "papaparse"

export default {
    list: async (): Promise<Product[]> =>{
        return axios
        .get("https://docs.google.com/spreadsheets/d/e/2PACX-1vSIoD4QjeOOIyKyRhBY6NOi3maRG-Jfs4QVQ_bF4qLtfLhhFE-lZjVD2Kngy5zp7rGdfeySHtpVuEuW/pub?output=csv",
        {
            responseType: "blob"
        },
    )
    .then(
        (response) => 
        new Promise<Product[]>((resolve, reject) =>{
            Papa.parse(response.data, {
                header: true, 
                complete: (results) => {
                    const products = results.data as Product[];

                    return resolve(
                        products.map((product) => ({
                            ...product, 
                            price: Number(product.price),
                        })), 
                    );
                },
                error: (error) => reject(error.message),
            })
        })
    )
    }
};

