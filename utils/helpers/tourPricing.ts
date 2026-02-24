export function getDiscountPercent(
  price: number,
  originalPrice: number | null | undefined,
): number | null {
  if (typeof originalPrice !== 'number') {
    return null;
  }

  if (originalPrice <= 0 || originalPrice <= price) {
    return null;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
