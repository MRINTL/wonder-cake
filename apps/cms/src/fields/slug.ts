import type { Field } from 'payload'

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie', ж: 'zh', з: 'z',
  и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'shch', ь: '', ю: 'iu', я: 'ia', ъ: '', ы: 'y', э: 'e', ё: 'e',
}

/** Транслітерація української латиницею + нормалізація в slug */
export const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .split('')
    .map((char) => (char in TRANSLIT ? TRANSLIT[char] : char))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (from = 'title'): Field[] => [
  {
    name: 'slug',
    type: 'text',
    label: 'Слаг (URL)',
    unique: true,
    index: true,
    admin: { position: 'sidebar', description: 'Латиницею, напр. tort-napoleon' },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.length > 0) return toSlug(value)
          const source = data?.[from]
          if (typeof source === 'string') return toSlug(source)
          return value
        },
      ],
    },
  },
]
