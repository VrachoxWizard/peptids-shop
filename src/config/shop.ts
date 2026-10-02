export const SHOP_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 70,
  SHIPPING_FEE: 4.9,
  PRODUCTS_PER_PAGE: 6,
} as const;

export function calculateShipping(subtotal: number): number {
  return subtotal >= SHOP_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : SHOP_CONFIG.SHIPPING_FEE;
}
