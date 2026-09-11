import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Налаштування сайту',
  admin: { group: 'Контент' },
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', label: 'Назва сайту', defaultValue: 'WonderCake' },
    { name: 'tagline', type: 'text', label: 'Слоган', defaultValue: 'Кондитерська ручної роботи' },
    {
      type: 'group',
      name: 'contacts',
      label: 'Контакти',
      fields: [
        { name: 'phone', type: 'text', label: 'Телефон', defaultValue: '+380 (67) 123-45-67' },
        { name: 'email', type: 'text', label: 'Email', defaultValue: 'hello@wondercake.ua' },
        { name: 'address', type: 'text', label: 'Адреса', defaultValue: 'Київ, вул. Хрещатик, 22' },
        { name: 'schedule', type: 'text', label: 'Графік', defaultValue: 'Щодня 09:00 — 21:00' },
        { name: 'mapEmbed', type: 'text', label: 'Посилання на карту' },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Соцмережі',
      fields: [
        { name: 'label', type: 'text', label: 'Назва', required: true },
        { name: 'href', type: 'text', label: 'Посилання', required: true },
      ],
    },
    {
      name: 'footerNote',
      type: 'textarea',
      label: 'Текст у футері',
      defaultValue: 'Печемо щодня з 2015 року. Доставка по Києву за 2 години.',
    },
    {
      name: 'delivery',
      type: 'array',
      label: 'Умови доставки (футер / контакти)',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'text', required: true },
      ],
    },
  ],
}
