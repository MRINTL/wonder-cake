const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000'

export type Media = { id: number; url: string; alt?: string; sizes?: Record<string, { url?: string }> }

export type Category = {
  id: number
  title: string
  slug: string
  group: 'cakes' | 'desserts'
  shape: 'cake' | 'donut' | 'cakepop' | 'other'
  description?: string
  order?: number
}

export type Holiday = {
  id: number
  title: string
  slug: string
  description?: string
  date?: string
  emoji?: string
  order?: number
}

export type Product = {
  id: number
  title: string
  slug: string
  shortDescription?: string
  description?: string
  category: Category
  image?: Media | null
  gallery?: { image: Media }[]
  price: number
  oldPrice?: number
  priceUnit: 'kg' | 'pcs' | 'set'
  minWeight?: number
  size?: string
  ingredients?: string
  allergens?: string[]
  calories?: number
  badges?: string[]
  holidays?: Holiday[]
  tags?: { value: string }[]
  available: boolean
  orders?: number
}

export type PageDoc = {
  id: number
  title: string
  slug: string
  intro?: string
  sections?: { heading?: string; body: string }[]
}

export type HomeGlobal = {
  hero: { eyebrow?: string; title: string; text?: string; primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string; image?: Media }
  counters: { donuts: number; donutsLabel?: string; cakesKg: number; cakesLabel?: string; years?: number; yearsLabel?: string }
  variants: { title?: string; text?: string }
  bestsellers: { title?: string; text?: string; limit?: number }
  cta: { title: string; text?: string; buttonLabel?: string; buttonHref?: string; image?: Media }
  faq: { title?: string; items?: { question: string; answer: string }[] }
}

export type SettingsGlobal = {
  siteName: string
  tagline?: string
  contacts: { phone?: string; email?: string; address?: string; schedule?: string; mapEmbed?: string }
  socials?: { label: string; href: string }[]
  footerNote?: string
  delivery?: { title: string; text: string }[]
}

type FindResponse<T> = { docs: T[]; totalDocs: number; page: number; totalPages: number; hasNextPage: boolean }

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${PAYLOAD_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  if (!response.ok) {
    throw new Error(`Payload ${response.status}: ${path}`)
  }
  return response.json() as Promise<T>
}

/** Порожня відповідь, якщо CMS недоступна — сайт має лишатися живим */
const safeFind = async <T>(path: string): Promise<FindResponse<T>> => {
  try {
    return await request<FindResponse<T>>(path)
  } catch (error) {
    console.error('[payload]', (error as Error).message)
    return { docs: [], totalDocs: 0, page: 1, totalPages: 0, hasNextPage: false }
  }
}

export const qs = (params: Record<string, string | number | undefined>): string =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')

export type ProductQuery = {
  categorySlug?: string
  categoryGroup?: 'cakes' | 'desserts'
  holidaySlug?: string
  badge?: string
  search?: string
  sort?: string
  limit?: number
  page?: number
}

export const getProducts = async (query: ProductQuery = {}): Promise<FindResponse<Product>> => {
  const where: string[] = []
  if (query.categorySlug) where.push(`where[category.slug][equals]=${encodeURIComponent(query.categorySlug)}`)
  if (query.categoryGroup) where.push(`where[category.group][equals]=${query.categoryGroup}`)
  if (query.holidaySlug) where.push(`where[holidays.slug][equals]=${encodeURIComponent(query.holidaySlug)}`)
  if (query.badge) where.push(`where[badges][contains]=${encodeURIComponent(query.badge)}`)
  if (query.search) {
    const q = encodeURIComponent(query.search)
    where.push(`where[or][0][title][like]=${q}`)
    where.push(`where[or][1][shortDescription][like]=${q}`)
    where.push(`where[or][2][description][like]=${q}`)
    where.push(`where[or][3][tags.value][like]=${q}`)
  }
  const base = qs({ depth: 2, limit: query.limit ?? 24, page: query.page ?? 1, sort: query.sort ?? '-orders' })
  return safeFind<Product>(`/api/products?${[base, ...where].join('&')}`)
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const result = await safeFind<Product>(`/api/products?depth=2&limit=1&where[slug][equals]=${encodeURIComponent(slug)}`)
  return result.docs[0] ?? null
}

export const getCategories = async (): Promise<Category[]> =>
  (await safeFind<Category>('/api/categories?limit=50&sort=order')).docs

export const getHolidays = async (): Promise<Holiday[]> =>
  (await safeFind<Holiday>('/api/holidays?limit=50&sort=order')).docs

export const getHolidayBySlug = async (slug: string): Promise<Holiday | null> => {
  const result = await safeFind<Holiday>(`/api/holidays?limit=1&where[slug][equals]=${encodeURIComponent(slug)}`)
  return result.docs[0] ?? null
}

export const getPage = async (slug: string): Promise<PageDoc | null> => {
  const result = await safeFind<PageDoc>(`/api/pages?depth=1&limit=1&where[slug][equals]=${encodeURIComponent(slug)}`)
  return result.docs[0] ?? null
}

const globalFallback = async <T>(slug: string, fallback: T): Promise<T> => {
  try {
    return await request<T>(`/api/globals/${slug}?depth=2`)
  } catch (error) {
    console.error('[payload]', (error as Error).message)
    return fallback
  }
}

export const getHome = (): Promise<HomeGlobal> =>
  globalFallback<HomeGlobal>('home', {
    hero: { title: 'WonderCake' },
    counters: { donuts: 0, cakesKg: 0 },
    variants: {},
    bestsellers: {},
    cta: { title: '' },
    faq: {},
  })

export const getSettings = (): Promise<SettingsGlobal> =>
  globalFallback<SettingsGlobal>('settings', {
    siteName: 'WonderCake',
    tagline: 'Кондитерська ручної роботи',
    contacts: {},
  })

/** Абсолютний URL для завантажених у CMS зображень */
export const mediaUrl = (media?: Media | null, size?: string): string | null => {
  if (!media) return null
  const sized = size && media.sizes?.[size]?.url
  const url = sized || media.url
  if (!url) return null
  return url.startsWith('http') ? url : `${PAYLOAD_URL}${url}`
}

export const payloadUrl = PAYLOAD_URL
