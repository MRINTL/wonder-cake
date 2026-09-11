import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Holidays } from './collections/Holidays'
import { Products } from './collections/Products'
import { Pages } from './collections/Pages'
import { Home } from './globals/Home'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const webUrl = process.env.WEB_URL || 'http://localhost:4321'

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · WonderCake CMS' },
  },
  collections: [Products, Categories, Holidays, Pages, Media, Customers, Users],
  globals: [Home, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'wondercake-demo-secret',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [webUrl],
  csrf: [webUrl],
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./wondercake.db' },
    push: true,
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  i18n: { fallbackLanguage: 'uk' },
})
