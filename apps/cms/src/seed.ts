import { getPayload } from 'payload'
import config from './payload.config'

/**
 * Демо-наповнення: `npm run seed`
 * Скидає каталог і створює категорії, свята, товари, сторінки та глобальні налаштування.
 */
const run = async () => {
  const payload = await getPayload({ config })

  const wipe = async (slug: 'products' | 'categories' | 'holidays' | 'pages') => {
    await payload.delete({ collection: slug, where: { id: { exists: true } } })
  }
  for (const slug of ['products', 'categories', 'holidays', 'pages'] as const) await wipe(slug)

  // --- Адміністратор і тестовий покупець ---
  const admins = await payload.find({ collection: 'users', limit: 1 })
  if (admins.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@wondercake.ua', password: 'wondercake', name: 'Адміністратор' },
    })
  }
  const customers = await payload.find({ collection: 'customers', limit: 1, where: { email: { equals: 'demo@wondercake.ua' } } })
  if (customers.totalDocs === 0) {
    await payload.create({
      collection: 'customers',
      data: { email: 'demo@wondercake.ua', password: 'wondercake', name: 'Олена Демо', phone: '+380671112233', city: 'Київ' },
    })
  }

  // --- Категорії ---
  const categoryData = [
    { title: 'Торти', slug: 'torty', group: 'cakes', shape: 'cake', order: 1, description: 'Бісквітні, муссові та бенто-торти на будь-яку подію.' },
    { title: 'Пончики', slug: 'ponchyky', group: 'desserts', shape: 'donut', order: 2, description: 'Пухкі дріжджові пончики з начинками та глазур’ю.' },
    { title: 'Кейкпопси', slug: 'keikpopsy', group: 'desserts', shape: 'cakepop', order: 3, description: 'Кульки на паличці — ідеальні для дитячих свят.' },
    { title: 'Інше', slug: 'inshe', group: 'desserts', shape: 'other', order: 4, description: 'Капкейки, еклери, макарони та подарункові бокси.' },
  ] as const

  const categories: Record<string, number | string> = {}
  for (const data of categoryData) {
    const doc = await payload.create({ collection: 'categories', data: data as never })
    categories[data.slug] = doc.id
  }

  // --- Свята ---
  const holidayData = [
    { title: 'День народження', slug: 'den-narodzhennia', emoji: '🎂', date: 'будь-який день', order: 1, description: 'Класика жанру: торт зі свічками та капкейки для гостей.' },
    { title: 'Весілля', slug: 'vesillia', emoji: '💍', date: 'сезон травень — вересень', order: 2, description: 'Багатоярусні торти та кенді-бар у стилістиці вашого дня.' },
    { title: 'Новий рік', slug: 'novyi-rik', emoji: '🎄', date: '31 грудня', order: 3, description: 'Пряники, імбирні пончики та святкові бокси.' },
    { title: '8 березня', slug: '8-bereznia', emoji: '🌷', date: '8 березня', order: 4, description: 'Ніжні мусові торти та набори кейкпопсів-тюльпанів.' },
    { title: 'Дитяче свято', slug: 'dytiache-sviato', emoji: '🎈', date: 'вихідні', order: 5, description: 'Яскраві десерти, які діти з’їдають першими.' },
  ] as const

  const holidays: Record<string, number | string> = {}
  for (const data of holidayData) {
    const doc = await payload.create({ collection: 'holidays', data: data as never })
    holidays[data.slug] = doc.id
  }

  // --- Товари ---
  type SeedProduct = {
    title: string
    category: keyof typeof categories
    price: number
    oldPrice?: number
    priceUnit: 'kg' | 'pcs' | 'set'
    minWeight?: number
    size?: string
    shortDescription: string
    description: string
    ingredients: string
    allergens: string[]
    calories: number
    badges?: string[]
    holidays?: string[]
    tags: string[]
    orders: number
  }

  const products: SeedProduct[] = [
    {
      title: 'Торт «Червоний оксамит»',
      category: 'torty', price: 890, priceUnit: 'kg', minWeight: 1.5,
      shortDescription: 'Оксамитові коржі, крем-чиз і ягідна нотка — наш бестселер уже сім років.',
      description: 'Три шари червоних коржів на натуральному барвнику з буряка, крем-чиз на вершках Президент та тонкий прошарок малинового конфі. Торт тримає форму навіть у спеку, тож підходить для виїзних свят.',
      ingredients: 'Борошно, цукор, яйця, вершкове масло, сир крем-чиз, вершки 33%, какао, малина, сік буряка.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 342,
      badges: ['hit'], holidays: ['den-narodzhennia', 'vesillia'],
      tags: ['червоний', 'red velvet', 'малина', 'крем-чиз'], orders: 512,
    },
    {
      title: 'Бенто-торт «Для двох»',
      category: 'torty', price: 420, priceUnit: 'pcs', size: 'Ø 12 см, 500 г',
      shortDescription: 'Маленький торт у крафтовій коробці з написом, який ви придумаєте.',
      description: 'Ідеальний спонтанний подарунок: пишемо будь-який напис кремом, пакуємо в бенто-коробку та доставляємо за дві години по Києву. Смак на вибір: ванільний, шоколадний або лимонний.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки, ванільний екстракт.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 318,
      badges: ['hit', 'new'], holidays: ['den-narodzhennia'],
      tags: ['бенто', 'напис', 'подарунок', 'міні'], orders: 476,
    },
    {
      title: 'Мусовий торт «Манго-маракуйя»',
      category: 'torty', price: 1120, oldPrice: 1290, priceUnit: 'kg', minWeight: 1.2,
      shortDescription: 'Дзеркальна глазур, тропічний мус і хрусткий дакуаз.',
      description: 'Мус на білому шоколаді з пюре манго й маракуї, мигдалевий дакуаз та желейне серце. Подається охолодженим, розморожується 3 години в холодильнику.',
      ingredients: 'Пюре манго, маракуя, білий шоколад, вершки, мигдалеве борошно, яєчний білок, желатин.',
      allergens: ['milk', 'eggs', 'nuts'], calories: 289,
      badges: ['sale'], holidays: ['vesillia', 'den-narodzhennia'],
      tags: ['мус', 'манго', 'дзеркальна глазур', 'тропічний'], orders: 301,
    },
    {
      title: 'Весільний торт «Ivory»',
      category: 'torty', price: 1450, priceUnit: 'kg', minWeight: 4,
      shortDescription: 'Три яруси, жива зелень і кремова текстура «полотно».',
      description: 'Класичний весільний торт з ванільно-ягідним наповненням. Декор — свіжі квіти від нашого флориста. Обов’язкове замовлення за 10 днів, безкоштовна дегустація перед підтвердженням.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки 33%, полуниця, ваніль Бурбон.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 355,
      holidays: ['vesillia'],
      tags: ['весілля', 'яруси', 'квіти', 'білий'], orders: 96,
    },
    {
      title: 'Пончики класичні, набір 6 шт',
      category: 'ponchyky', price: 320, priceUnit: 'set', size: 'набір 6 шт',
      shortDescription: 'Шість дріжджових пончиків: полуниця, шоколад, солона карамель.',
      description: 'Тісто вистоюється 12 годин, тому пончики виходять пухкими й легкими. Смажимо вранці, доставляємо теплими. У наборі по два пончики кожного смаку.',
      ingredients: 'Борошно, молоко, дріжджі, яйця, цукор, шоколад, полуничне пюре, карамель, морська сіль.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 401,
      badges: ['hit'], holidays: ['dytiache-sviato', 'den-narodzhennia'],
      tags: ['пончики', 'донати', 'набір', 'карамель'], orders: 934,
    },
    {
      title: 'Пончик «Фісташка-малина»',
      category: 'ponchyky', price: 65, priceUnit: 'pcs', size: '1 шт, 95 г',
      shortDescription: 'Фісташковий крем усередині, малинова глазур зверху.',
      description: 'Найпопулярніший поштучний пончик: справжня фісташкова паста без ароматизаторів і кисла малинова глазур для балансу.',
      ingredients: 'Борошно, молоко, дріжджі, фісташкова паста, малина, цукрова пудра.',
      allergens: ['gluten', 'milk', 'nuts'], calories: 428,
      badges: ['new'],
      tags: ['фісташка', 'малина', 'пончик'], orders: 688,
    },
    {
      title: 'Імбирні пончики «Новорічні»',
      category: 'ponchyky', price: 380, priceUnit: 'set', size: 'набір 6 шт',
      shortDescription: 'Кориця, імбир і біла глазур зі сніжинками.',
      description: 'Сезонний набір, який ми печемо з 1 грудня до 10 січня. Пакуємо у святкову коробку — можна одразу дарувати.',
      ingredients: 'Борошно, молоко, дріжджі, імбир, кориця, мускатний горіх, білий шоколад.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 415,
      holidays: ['novyi-rik'],
      tags: ['новий рік', 'імбир', 'кориця', 'подарунок'], orders: 254,
    },
    {
      title: 'Кейкпопси «Єдноріг», набір 9 шт',
      category: 'keikpopsy', price: 450, priceUnit: 'set', size: 'набір 9 шт',
      shortDescription: 'Пастельні кульки на паличці з їстівними блискітками.',
      description: 'Улюблений десерт на дитячих святах: ванільний бісквіт із крем-чизом у кольоровій глазурі. Можемо зробити у кольорах вашого свята.',
      ingredients: 'Бісквіт, крем-чиз, білий шоколад, харчові барвники, кондитерська посипка.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 372,
      badges: ['hit'], holidays: ['dytiache-sviato'],
      tags: ['кейкпопси', 'діти', 'єдиноріг', 'набір'], orders: 421,
    },
    {
      title: 'Кейкпопси-тюльпани, набір 5 шт',
      category: 'keikpopsy', price: 290, priceUnit: 'set', size: 'набір 5 шт',
      shortDescription: 'Букет, який можна з’їсти — замість зрізаних квітів.',
      description: 'Кейкпопси у формі тюльпанів, зібрані в паперовий букет. Найчастіше замовляють на 8 березня та День матері.',
      ingredients: 'Бісквіт, крем-чиз, білий шоколад, натуральні барвники.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 365,
      badges: ['new'], holidays: ['8-bereznia'],
      tags: ['тюльпани', 'букет', '8 березня'], orders: 187,
    },
    {
      title: 'Капкейки асорті, набір 4 шт',
      category: 'inshe', price: 280, priceUnit: 'set', size: 'набір 4 шт',
      shortDescription: 'Ванільний, шоколадний, лимонний і ягідний — по одному.',
      description: 'Зручний спосіб спробувати чотири смаки одразу. Шапочка з крем-чизу тримається до 8 годин поза холодильником.',
      ingredients: 'Борошно, цукор, яйця, масло, крем-чиз, лимон, чорниця, какао.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 388,
      tags: ['капкейки', 'асорті', 'офіс'], orders: 344,
    },
    {
      title: 'Макарони, коробка 12 шт',
      category: 'inshe', price: 540, oldPrice: 620, priceUnit: 'set', size: 'коробка 12 шт',
      shortDescription: 'Шість смаків французьких макаронів у подарунковій коробці.',
      description: 'Фісташка, малина, солона карамель, лимон, лаванда та шоколад. Дозрівають добу в холодильнику — саме тому такі ніжні.',
      ingredients: 'Мигдалеве борошно, цукрова пудра, яєчний білок, вершки, фісташка, малина, лаванда.',
      allergens: ['milk', 'eggs', 'nuts'], calories: 404,
      badges: ['sale'], holidays: ['8-bereznia', 'vesillia'],
      tags: ['макарони', 'французькі', 'подарунок'], orders: 275,
    },
    {
      title: 'Подарунковий бокс «Солодка пошта»',
      category: 'inshe', price: 690, priceUnit: 'set', size: 'бокс, 1.1 кг',
      shortDescription: 'Пончики, кейкпопси, макарони й листівка з вашим текстом.',
      description: 'Збірний бокс для тих, хто не може обрати щось одне. Додаємо рукописну листівку та доставляємо у зазначений час.',
      ingredients: 'Асорті десертів WonderCake.',
      allergens: ['gluten', 'milk', 'eggs', 'nuts'], calories: 396,
      badges: ['hit', 'new'], holidays: ['novyi-rik', 'den-narodzhennia'],
      tags: ['бокс', 'подарунок', 'асорті', 'листівка'], orders: 398,
    },
  ]

  for (const p of products) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description,
        category: categories[p.category],
        price: p.price,
        oldPrice: p.oldPrice,
        priceUnit: p.priceUnit,
        minWeight: p.minWeight,
        size: p.size,
        ingredients: p.ingredients,
        allergens: p.allergens,
        calories: p.calories,
        badges: p.badges ?? [],
        holidays: (p.holidays ?? []).map((h) => holidays[h]),
        tags: p.tags.map((value) => ({ value })),
        available: true,
        orders: p.orders,
      } as never,
    })
  }

  // --- Текстові сторінки ---
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Про нас',
      slug: 'pro-nas',
      intro: 'WonderCake — сімейна кондитерська у Києві. Ми печемо щодня з 2015 року і досі не купили жодного напівфабрикату.',
      sections: [
        { heading: 'Як усе почалося', body: 'Усе почалося з домашньої кухні на Подолі та одного замовлення на день народження подруги.\n\nСьогодні в нас цех на 300 м², 14 кондитерів і власна школа для стажерів. Але рецепт «Червоного оксамиту» — той самий, з 2015 року.' },
        { heading: 'Наш підхід', body: 'Ми не працюємо з сухими сумішами, рослинними вершками та барвниками, які не використали б удома.\n\nКожен торт збирається під конкретне замовлення, а не «на вітрину». Тому мінімальний час на торт — 48 годин.' },
        { heading: 'Команда', body: 'Шеф-кондитер Марія відповідає за смак, Андрій — за декор, а Оля читає всі відгуки і телефонує, якщо щось пішло не так.\n\nМи справді передзвонюємо.' },
      ],
    } as never,
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Політика конфіденційності',
      slug: 'polityka',
      intro: 'Демонстраційний текст. Перед запуском замініть на юридично вивірену редакцію.',
      sections: [
        { heading: 'Які дані ми збираємо', body: 'Ім’я, телефон, email та адресу доставки — лише для оформлення й доставки замовлення.\n\nПлатіжні дані ми не зберігаємо: оплата проходить на боці банку.' },
        { heading: 'Навіщо ми їх використовуємо', body: 'Щоб підтвердити замовлення, доставити його вчасно та надіслати чек.\n\nМаркетингові розсилки надсилаємо тільки за окремою згодою, від якої можна відмовитися одним кліком.' },
        { heading: 'Cookies', body: 'Сайт зберігає у вашому браузері кошик, обране та сесію входу. Ці дані не передаються третім особам.' },
        { heading: 'Ваші права', body: 'Ви можете запросити копію своїх даних або їх видалення, написавши на hello@wondercake.ua.\n\nМи відповідаємо протягом 30 днів.' },
      ],
    } as never,
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Умови використання',
      slug: 'umovy',
      intro: 'Демонстраційний текст. Перед запуском замініть на юридично вивірену редакцію.',
      sections: [
        { heading: 'Замовлення', body: 'Замовлення вважається підтвердженим після дзвінка менеджера.\n\nТорти на замовлення приймаємо мінімум за 48 годин, багатоярусні — за 10 днів.' },
        { heading: 'Оплата', body: 'Готівкою при отриманні, карткою онлайн або переказом для юридичних осіб.\n\nДля індивідуальних тортів передоплата — 50%.' },
        { heading: 'Доставка', body: 'Київ у межах Великої кільцевої — 150 ₴, безкоштовно від 1500 ₴.\n\nДоставляємо у двогодинні інтервали з 09:00 до 21:00.' },
        { heading: 'Повернення', body: 'Кондитерські вироби належної якості поверненню не підлягають.\n\nЯкщо щось не так — сфотографуйте десерт і напишіть нам того ж дня, ми компенсуємо вартість.' },
      ],
    } as never,
  })

  // --- Глобальні налаштування ---
  await payload.updateGlobal({
    slug: 'home',
    data: {
      hero: {
        eyebrow: 'Кондитерська у Києві з 2015 року',
        title: 'Десерти, заради яких повертаються',
        text: 'Печемо щодня зранку, доставляємо теплими за дві години. Без сухих сумішей, рослинних вершків і «майже свіжого» вчорашнього.',
        primaryLabel: 'Обрати десерт',
        primaryHref: '/katalog',
        secondaryLabel: 'Торт на замовлення',
        secondaryHref: '/torty',
      },
      counters: {
        donuts: 128400, donutsLabel: 'пончиків спекли',
        cakesKg: 9600, cakesLabel: 'кілограмів тортів продали',
        years: 11, yearsLabel: 'років радуємо Київ',
      },
      variants: {
        title: 'Що будемо святкувати?',
        text: 'Чотири напрямки, у яких ми найсильніші. Оберіть свій — або відкрийте весь каталог.',
      },
      bestsellers: {
        title: 'Найчастіше замовляють',
        text: 'Позиції, які повертаються у кошики найчастіше — за даними замовлень за останні 90 днів.',
        limit: 8,
      },
      cta: {
        title: 'Торт за вашим ескізом',
        text: 'Надішліть картинку, ідею чи навіть фото серветки — кондитер порахує вартість і запропонує варіант за 30 хвилин.',
        buttonLabel: 'Розрахувати торт',
        buttonHref: '/kontakty',
      },
      faq: {
        title: 'Питання, які ставлять найчастіше',
        items: [
          { question: 'За скільки днів замовляти торт?', answer: 'Стандартні торти з каталогу — за 48 годин. Індивідуальний декор і багатоярусні — за 7–10 днів. Бенто-торти й пончики часто встигаємо зробити день у день, зателефонуйте нам.' },
          { question: 'Чи є доставка та скільки коштує?', answer: 'Доставляємо по Києву щодня з 09:00 до 21:00 у двогодинні інтервали. 150 ₴ у межах Великої кільцевої, безкоштовно при замовленні від 1500 ₴.' },
          { question: 'Чи можна замовити без цукру або без глютену?', answer: 'Так, у нас є безглютенові бісквіти та варіанти на еритриті. Наберіть менеджера — підберемо позицію під ваші обмеження й попередимо про можливі сліди алергенів у цеху.' },
          { question: 'Скільки зберігається десерт?', answer: 'Торти з крем-чизом — до 72 годин у холодильнику, мусові — до 48 годин, пончики найсмачніші в день випікання. Точний термін пишемо на етикетці.' },
          { question: 'Як розрахувати вагу торта на кількість гостей?', answer: 'Орієнтир простий: 150–200 г на гостя, якщо торт — єдиний десерт на столі, і 100–120 г, якщо є ще солодощі. На 20 гостей зазвичай беруть торт на 3 кг.' },
          { question: 'Чи можна оплатити карткою?', answer: 'Так: карткою онлайн, готівкою при отриманні або переказом для юридичних осіб. Для індивідуальних тортів беремо 50% передоплати.' },
        ],
      },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      siteName: 'WonderCake',
      tagline: 'Кондитерська ручної роботи',
      contacts: {
        phone: '+380 (67) 123-45-67',
        email: 'hello@wondercake.ua',
        address: 'Київ, вул. Хрещатик, 22',
        schedule: 'Щодня 09:00 — 21:00',
      },
      socials: [
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'Telegram', href: 'https://telegram.org' },
        { label: 'Facebook', href: 'https://facebook.com' },
      ],
      footerNote: 'Печемо щодня з 2015 року. Доставка по Києву за 2 години.',
      delivery: [
        { title: 'Доставка по Києву', text: '150 ₴, безкоштовно від 1500 ₴' },
        { title: 'Самовивіз', text: 'Хрещатик, 22 — щодня 09:00–21:00' },
        { title: 'Торт на замовлення', text: 'мінімум за 48 годин' },
      ],
    } as never,
  })

  payload.logger.info('✅ Демо-дані створені. Адмін: admin@wondercake.ua / wondercake')
  process.exit(0)
}

try {
  await run()
} catch (error) {
  console.error(error)
  process.exit(1)
}
