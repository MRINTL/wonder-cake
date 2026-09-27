import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Головна сторінка',
  admin: { group: 'Контент' },
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: 'Hero-екран',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Надзаголовок' },
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Заголовок — рожевий рядок',
          admin: { description: 'Останній рядок заголовка, виділений кольором. Напр. «і на свято».' },
        },
        { name: 'text', type: 'textarea', label: 'Текст', admin: { rows: 3 } },
        { name: 'primaryLabel', type: 'text', label: 'Кнопка 1 — текст', defaultValue: 'Обрати десерт' },
        { name: 'primaryHref', type: 'text', label: 'Кнопка 1 — посилання', defaultValue: '/katalog' },
        { name: 'secondaryLabel', type: 'text', label: 'Кнопка 2 — текст', defaultValue: 'Торти на замовлення' },
        { name: 'secondaryHref', type: 'text', label: 'Кнопка 2 — посилання', defaultValue: '/torty' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Зображення' },
      ],
    },
    {
      type: 'group',
      name: 'counters',
      label: 'Лічильники',
      fields: [
        { name: 'donuts', type: 'number', label: 'Продано пончиків, шт', required: true, defaultValue: 128400 },
        { name: 'donutsLabel', type: 'text', label: 'Підпис 1', defaultValue: 'пончиків спекли' },
        { name: 'cakesKg', type: 'number', label: 'Продано тортів, кг', required: true, defaultValue: 9600 },
        { name: 'cakesLabel', type: 'text', label: 'Підпис 2', defaultValue: 'кілограмів тортів' },
        { name: 'years', type: 'number', label: 'Років на ринку', defaultValue: 11 },
        { name: 'yearsLabel', type: 'text', label: 'Підпис 3', defaultValue: 'років радуємо Київ' },
      ],
    },
    {
      type: 'group',
      name: 'variants',
      label: 'Блок «Варіанти товару»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', defaultValue: 'Що будемо святкувати?' },
        { name: 'text', type: 'textarea', label: 'Підзаголовок' },
      ],
    },
    {
      type: 'group',
      name: 'bestsellers',
      label: 'Блок «Найчастіше замовляють»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', defaultValue: 'Найчастіше замовляють' },
        { name: 'text', type: 'textarea', label: 'Підзаголовок' },
        { name: 'limit', type: 'number', label: 'Скільки товарів показати', defaultValue: 8 },
      ],
    },
    {
      type: 'group',
      name: 'cta',
      label: 'CTA-банер',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'textarea', label: 'Текст' },
        { name: 'buttonLabel', type: 'text', label: 'Кнопка — текст', defaultValue: 'Розрахувати торт' },
        { name: 'buttonHref', type: 'text', label: 'Кнопка — посилання', defaultValue: '/kontakty' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Зображення' },
      ],
    },
    {
      type: 'group',
      name: 'faq',
      label: 'FAQ',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', defaultValue: 'Питання, які ставлять найчастіше' },
        {
          name: 'items',
          type: 'array',
          label: 'Питання',
          fields: [
            { name: 'question', type: 'text', label: 'Питання', required: true },
            { name: 'answer', type: 'textarea', label: 'Відповідь', required: true, admin: { rows: 4 } },
          ],
        },
      ],
    },
  ],
}
