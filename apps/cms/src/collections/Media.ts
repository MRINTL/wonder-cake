import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Медіа', plural: 'Медіа' },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640, height: 640, position: 'centre' },
      { name: 'hero', width: 1280, height: undefined },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt-текст', required: true },
  ],
}
