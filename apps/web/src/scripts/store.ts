/** Кошик і обране: локальний стан у localStorage + делеговані обробники на всьому сайті */

export type CartItem = {
  id: number
  slug: string
  title: string
  price: number
  unit: 'kg' | 'pcs' | 'set'
  shape?: string
  qty: number
}

export type FavItem = Omit<CartItem, 'qty'>

const CART_KEY = 'wondercake:cart'
const FAV_KEY = 'wondercake:favorites'

const read = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

const write = <T>(key: string, value: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* приватний режим — просто ігноруємо */
  }
}

export const getCart = (): CartItem[] => read<CartItem>(CART_KEY)
export const getFavorites = (): FavItem[] => read<FavItem>(FAV_KEY)

const emit = (): void => {
  document.dispatchEvent(new CustomEvent('store:change'))
  syncBadges()
  syncFavButtons()
}

export const setCart = (items: CartItem[]): void => {
  write(CART_KEY, items)
  emit()
}

export const addToCart = (item: Omit<CartItem, 'qty'>, qty = 1): void => {
  const cart = getCart()
  const existing = cart.find((entry) => entry.id === item.id)
  if (existing) existing.qty += qty
  else cart.push({ ...item, qty })
  setCart(cart)
}

export const setQty = (id: number, qty: number): void => {
  const cart = getCart()
    .map((entry) => (entry.id === id ? { ...entry, qty: Math.max(1, qty) } : entry))
  setCart(cart)
}

export const removeFromCart = (id: number): void => {
  setCart(getCart().filter((entry) => entry.id !== id))
}

export const clearCart = (): void => setCart([])

export const toggleFavorite = (item: FavItem): boolean => {
  const favorites = getFavorites()
  const index = favorites.findIndex((entry) => entry.id === item.id)
  if (index >= 0) {
    favorites.splice(index, 1)
    write(FAV_KEY, favorites)
    emit()
    return false
  }
  favorites.push(item)
  write(FAV_KEY, favorites)
  emit()
  return true
}

export const removeFavorite = (id: number): void => {
  write(FAV_KEY, getFavorites().filter((entry) => entry.id !== id))
  emit()
}

export const cartTotal = (): number =>
  getCart().reduce((sum, entry) => sum + entry.price * entry.qty, 0)

export const cartCount = (): number =>
  getCart().reduce((sum, entry) => sum + entry.qty, 0)

/** Оновлення бейджів у шапці */
function syncBadges(): void {
  const cart = cartCount()
  const favorites = getFavorites().length
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((node) => {
    node.textContent = String(cart)
    node.hidden = cart === 0
    node.classList.toggle('hidden', cart === 0)
  })
  document.querySelectorAll<HTMLElement>('[data-fav-count]').forEach((node) => {
    node.textContent = String(favorites)
    node.hidden = favorites === 0
    node.classList.toggle('hidden', favorites === 0)
  })
}

/** Підсвічування сердечок для товарів, що вже в обраному */
function syncFavButtons(): void {
  const ids = new Set(getFavorites().map((entry) => entry.id))
  document.querySelectorAll<HTMLElement>('[data-fav-toggle]').forEach((button) => {
    try {
      const item = JSON.parse(button.dataset.favToggle || '{}') as FavItem
      const active = ids.has(item.id)
      button.dataset.active = String(active)
      const path = button.querySelector<SVGPathElement>('.fav-fill')
      if (path) path.setAttribute('fill', active ? 'currentColor' : 'none')
    } catch {
      /* некоректний payload — пропускаємо */
    }
  })
}

const flash = (message: string): void => {
  let toast = document.querySelector<HTMLElement>('[data-toast]')
  if (!toast) {
    toast = document.createElement('div')
    toast.dataset.toast = ''
    toast.className =
      'fixed inset-x-4 bottom-4 z-70 mx-auto max-w-sm rounded-full bg-navy px-5 py-3 text-center text-sm font-bold text-white shadow-lg transition-opacity duration-300 sm:left-auto sm:right-6 sm:mx-0'
    document.body.appendChild(toast)
  }
  toast.textContent = message
  toast.style.opacity = '1'
  window.clearTimeout(Number(toast.dataset.timer || 0))
  toast.dataset.timer = String(window.setTimeout(() => { toast!.style.opacity = '0' }, 2200))
}

/** Делеговані кліки: додати в кошик / перемкнути обране */
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement

  const cartButton = target.closest<HTMLElement>('[data-add-to-cart]')
  if (cartButton) {
    event.preventDefault()
    const item = JSON.parse(cartButton.dataset.addToCart || '{}') as Omit<CartItem, 'qty'>
    const qtyInput = document.querySelector<HTMLInputElement>('[data-qty-input]')
    const qty = cartButton.hasAttribute('data-use-qty') && qtyInput ? Number(qtyInput.value) || 1 : 1
    addToCart(item, qty)
    flash(`«${item.title}» у кошику`)
    return
  }

  const favButton = target.closest<HTMLElement>('[data-fav-toggle]')
  if (favButton) {
    event.preventDefault()
    const item = JSON.parse(favButton.dataset.favToggle || '{}') as FavItem
    const added = toggleFavorite(item)
    flash(added ? 'Додано в обране' : 'Прибрано з обраного')
  }
})

/** Мобільне меню та пошук */
const toggle = (selector: string, open: boolean): void => {
  const panel = document.querySelector<HTMLElement>(selector)
  if (!panel) return
  panel.hidden = !open
  document.body.style.overflow = open && selector === '[data-menu-panel]' ? 'hidden' : ''
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (target.closest('[data-menu-open]')) toggle('[data-menu-panel]', true)
  if (target.closest('[data-menu-close]')) toggle('[data-menu-panel]', false)
  if (target.closest('[data-search-close]')) toggle('[data-search-panel]', false)
  if (target.closest('[data-search-open]')) {
    const panel = document.querySelector<HTMLElement>('[data-search-panel]')
    const open = panel?.hidden ?? true
    toggle('[data-search-panel]', open)
    if (open) document.querySelector<HTMLInputElement>('[data-search-input]')?.focus()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggle('[data-menu-panel]', false)
    toggle('[data-search-panel]', false)
  }
})

syncBadges()
syncFavButtons()

declare global {
  interface Window {
    wonderStore: {
      getCart: typeof getCart
      getFavorites: typeof getFavorites
      setQty: typeof setQty
      removeFromCart: typeof removeFromCart
      removeFavorite: typeof removeFavorite
      clearCart: typeof clearCart
      addToCart: typeof addToCart
      cartTotal: typeof cartTotal
    }
  }
}

window.wonderStore = { getCart, getFavorites, setQty, removeFromCart, removeFavorite, clearCart, addToCart, cartTotal }
