import type { Product } from './payload'

export const UNIT_LABEL: Record<Product['priceUnit'], string> = {
  kg: 'за кг',
  pcs: 'за шт',
  set: 'за набір',
}

export const BADGE_LABEL: Record<string, string> = {
  hit: 'Хіт',
  new: 'Новинка',
  sale: 'Акція',
}

export const ALLERGEN_LABEL: Record<string, string> = {
  gluten: 'глютен',
  milk: 'молоко',
  eggs: 'яйця',
  nuts: 'горіхи',
  soy: 'соя',
}

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(value)

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(value)

/** «1 товар / 2 товари / 5 товарів» */
export const plural = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** Число з українською комою: 1.5 → «1,5» */
export const formatDecimal = (value: number): string =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(value)

/**
 * Підпис під ціною. Для ваги — одиниця + мінімум,
 * для штучних і наборів — фасування, якщо воно вже все пояснює.
 */
export const priceMeta = (product: Product): string => {
  if (product.priceUnit === 'kg') {
    return product.minWeight
      ? `за кг · від ${formatDecimal(product.minWeight)} кг`
      : 'за кг'
  }
  return product.size || UNIT_LABEL[product.priceUnit]
}
