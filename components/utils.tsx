export function parseCurrency(value: number): string {
  return value.toLocaleString("es-Ar", {
    style: "currency",
    currency: "ARS",
  });
}
