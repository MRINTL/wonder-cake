import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категорія', plural: 'Категорії' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'group'], group: 'Каталог' },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Назва', required: true },
    ...slugField(),
    {
      name: 'group',
      type: 'select',
      label: 'Розділ меню',
      required: true,
      defaultValue: 'desserts',
      options: [
        { label: 'Торти', value: 'cakes' },
        { label: 'Десерти', value: 'desserts' },
      ],
      admin: { description: 'Визначає, у якому розділі меню показувати категорію.' },
    },
    {
      name: 'shape',
      type: 'select',
      label: 'Ілюстрація-заглушка',
      defaultValue: 'cake',
      options: [
        { label: 'Торт', value: 'cake' },
        { label: 'Пончик', value: 'donut' },
        { label: 'Кейкпопс', value: 'cakepop' },
        { label: 'Інше', value: 'other' },
      ],
    },
    { name: 'description', type: 'textarea', label: 'Опис' },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0 },
  ],
}
