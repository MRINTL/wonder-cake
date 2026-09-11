import type { CollectionConfig } from 'payload'

/** Адміністратори CMS */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Адміністратор', plural: 'Адміністратори' },
  auth: true,
  admin: { useAsTitle: 'email', group: 'Адмін' },
  fields: [
    { name: 'name', type: 'text', label: "Ім'я" },
  ],
}
