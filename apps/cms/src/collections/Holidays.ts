import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/** Свята — теги для добірок «до свята» */
export const Holidays: CollectionConfig = {
  slug: 'holidays',
  labels: { singular: 'Свято', plural: 'Свята' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'date'], group: 'Каталог' },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Назва', required: true },
    ...slugField(),
    { name: 'description', type: 'textarea', label: 'Опис' },
    { name: 'date', type: 'text', label: 'Дата (текстом)', admin: { description: 'Напр. «8 березня»' } },
    { name: 'emoji', type: 'text', label: 'Емодзі' },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0 },
  ],
}
