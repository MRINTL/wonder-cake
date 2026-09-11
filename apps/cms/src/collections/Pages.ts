import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/** Текстові сторінки: про нас, політика, умови */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Сторінка', plural: 'Сторінки' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'], group: 'Контент' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    ...slugField(),
    { name: 'intro', type: 'textarea', label: 'Вступний текст', admin: { rows: 3 } },
    {
      name: 'sections',
      type: 'array',
      label: 'Секції',
      fields: [
        { name: 'heading', type: 'text', label: 'Підзаголовок' },
        { name: 'body', type: 'textarea', label: 'Текст', required: true, admin: { rows: 6, description: 'Абзаци розділяються порожнім рядком.' } },
      ],
    },
  ],
}
