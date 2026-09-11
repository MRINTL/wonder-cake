import type { CollectionConfig } from 'payload'

/** Покупці сайту — окрема auth-колекція, використовується сторінками входу/реєстрації */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: 'Покупець', plural: 'Покупці' },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  admin: { useAsTitle: 'email', group: 'Магазин' },
  access: {
    // реєстрація з сайту доступна всім
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => Boolean(user && user.collection === 'users'),
  },
  fields: [
    { name: 'name', type: 'text', label: "Ім'я", required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
    { name: 'city', type: 'text', label: 'Місто' },
  ],
}
