const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * Внутрішнє посилання з урахуванням base (/wonder-cake) і слешем у кінці,
 * щоб GitHub Pages не робив редірект: '/katalog?x=1' → '/wonder-cake/katalog/?x=1'.
 * Зовнішні посилання, tel:, mailto: і якорі повертаються як є.
 */
export const url = (path: string): string => {
  if (!path.startsWith('/')) return path
  const [, pathname, rest] = path.match(/^([^?#]*)(.*)$/)!
  const isFile = /\.[a-z0-9]+$/i.test(pathname)
  return `${BASE}${pathname.endsWith('/') || isFile ? pathname : `${pathname}/`}${rest}`
}

/** Шлях сторінки без base і кінцевого слеша — для підсвічування активного пункту меню */
export const pagePath = (pathname: string): string => {
  const path = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname
  return path.replace(/\/$/, '') || '/'
}
