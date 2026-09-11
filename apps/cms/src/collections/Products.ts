import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Товар', plural: 'Товари' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'available'],
    group: 'Каталог',
  },
  access: { read: () => true },
  defaultSort: '-orders',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основне',
          fields: [
            { name: 'title', type: 'text', label: 'Назва', required: true },
            { name: 'shortDescription', type: 'textarea', label: 'Короткий опис', maxLength: 180 },
            { name: 'description', type: 'textarea', label: 'Повний опис', admin: { rows: 6 } },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              label: 'Категорія',
              required: true,
            },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Фото' },
            {
              name: 'gallery',
              type: 'array',
              label: 'Галерея',
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
          ],
        },
        {
          label: 'Ціна та розмір',
          fields: [
            { name: 'price', type: 'number', label: 'Ціна, ₴', required: true, min: 0 },
            { name: 'oldPrice', type: 'number', label: 'Стара ціна, ₴', min: 0 },
            {
              name: 'priceUnit',
              type: 'select',
              label: 'Одиниця ціни',
              required: true,
              defaultValue: 'kg',
              options: [
                { label: 'за кг', value: 'kg' },
                { label: 'за шт', value: 'pcs' },
                { label: 'за набір', value: 'set' },
              ],
            },
            {
              name: 'minWeight',
              type: 'number',
              label: 'Мінімальна вага, кг',
              admin: { condition: (data) => data?.priceUnit === 'kg' },
            },
            { name: 'size', type: 'text', label: 'Розмір / фасування', admin: { description: 'Напр. «набір 9 шт» або «Ø 22 см»' } },
          ],
        },
        {
          label: 'Склад',
          fields: [
            { name: 'ingredients', type: 'textarea', label: 'Склад', admin: { rows: 4 } },
            {
              name: 'allergens',
              type: 'select',
              label: 'Алергени',
              hasMany: true,
              options: [
                { label: 'Глютен', value: 'gluten' },
                { label: 'Молоко', value: 'milk' },
                { label: 'Яйця', value: 'eggs' },
                { label: 'Горіхи', value: 'nuts' },
                { label: 'Соя', value: 'soy' },
              ],
            },
            { name: 'calories', type: 'number', label: 'Калорійність, ккал/100 г' },
          ],
        },
        {
          label: 'Мітки',
          fields: [
            {
              name: 'badges',
              type: 'select',
              label: 'Бейджі',
              hasMany: true,
              options: [
                { label: 'Хіт', value: 'hit' },
                { label: 'Новинка', value: 'new' },
                { label: 'Акція', value: 'sale' },
              ],
            },
            {
              name: 'holidays',
              type: 'relationship',
              relationTo: 'holidays',
              hasMany: true,
              label: 'Свята',
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Теги для пошуку',
              fields: [{ name: 'value', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
    ...slugField(),
    { name: 'available', type: 'checkbox', label: 'В наявності', defaultValue: true, admin: { position: 'sidebar' } },
    {
      name: 'orders',
      type: 'number',
      label: 'Замовлень (популярність)',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Використовується у блоці «Найчастіше замовляють».' },
    },
  ],
}
