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
    /** Задаємо явно там, де слаг має збігтися з іменем файлу фото у web/public/images */
    slug?: string
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
      slug: 'ponchyky-klasychni-nabir-6-sht',
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
      slug: 'keikpopsy-iednorih-nabir-9-sht',
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
    {
      title: 'Дитячий торт «Піксельний світ»',
      slug: 'dytiachyi-tort-pikselnyi-svit',
      category: 'torty', price: 950, priceUnit: 'kg', minWeight: 2,
      shortDescription: 'Шоколадний торт із цукровими топерами та зеленими патьоками — для гри улюбленого формату.',
      description: 'Шоколадні коржі з вершковим кремом, патьоки з білого шоколаду та цукрові фігурки на тему улюбленої гри. Цифру віку й набір героїв узгоджуємо перед випіканням.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки 33%, какао, білий шоколад, харчові барвники.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 364,
      badges: ['hit'], holidays: ['dytiache-sviato', 'den-narodzhennia'],
      tags: ['дитячий', 'гра', 'топери', 'на замовлення'], orders: 289,
    },
    {
      title: 'Дитячий торт «Ігрові герої»',
      slug: 'dytiachyi-tort-igrovi-heroi',
      category: 'torty', price: 950, priceUnit: 'kg', minWeight: 2,
      shortDescription: 'Яскравий червоний торт із персонажами та великою цифрою віку.',
      description: 'Бісквіт на вибір — ванільний або шоколадний — із ягідним прошарком, кольорові патьоки й цукрова картинка з героями. Цифру робимо в тон декору.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки 33%, малина, харчові барвники.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 358,
      badges: ['new'], holidays: ['dytiache-sviato', 'den-narodzhennia'],
      tags: ['дитячий', 'герої', 'цифра', 'на замовлення'], orders: 217,
    },
    {
      title: 'Дитячий торт «Пташки»',
      slug: 'dytiachyi-tort-ptashky',
      category: 'torty', price: 950, priceUnit: 'kg', minWeight: 2,
      shortDescription: 'Зелений торт із мультяшними фігурками — найчастіше беруть на 4–6 років.',
      description: 'Ванільні коржі з кремом на вершках, зелене оздоблення й ліплені фігурки. Колір і персонажів підбираємо під запрошення чи кульки свята.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки 33%, ваніль, харчові барвники.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 349,
      holidays: ['dytiache-sviato'],
      tags: ['дитячий', 'пташки', 'зелений', 'на замовлення'], orders: 164,
    },
    {
      title: 'Кейкпопс поштучно',
      slug: 'keikpops-poshtuchno',
      category: 'keikpopsy', price: 65, priceUnit: 'pcs', size: '1 шт, 45 г',
      shortDescription: 'Один кейкпопс у кольоровій посипці — зручно добрати до набору.',
      description: 'Бісквіт із крем-чизом у глазурі та посипці. Беруть поштучно, коли треба рівно стільки, скільки гостей, або щоб доповнити готовий набір.',
      ingredients: 'Бісквіт, крем-чиз, білий шоколад, кондитерська посипка.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 370,
      tags: ['кейкпопс', 'поштучно', 'посипка'], orders: 352,
    },
    {
      title: 'Кейксикли шоколадні, набір 4 шт',
      slug: 'keiksykly-shokoladni',
      category: 'inshe', price: 420, priceUnit: 'set', size: 'набір 4 шт',
      shortDescription: 'Тістечка-ескімо в темному шоколаді з начинкою з брауні.',
      description: 'Форма морозива на паличці, всередині — вологий брауні з кремом. Тримають форму поза холодильником до чотирьох годин, тож зручні для фотозони.',
      ingredients: 'Темний шоколад, борошно, цукор, яйця, масло, вершки 33%, какао.',
      allergens: ['gluten', 'milk', 'eggs'], calories: 432,
      badges: ['new'], holidays: ['den-narodzhennia'],
      tags: ['кейксикли', 'ескімо', 'шоколад', 'брауні'], orders: 198,
    },
    {
      title: 'Тістечка на паличці, асорті 8 шт',
      slug: 'tistechka-na-palychtsi',
      category: 'inshe', price: 480, priceUnit: 'set', size: 'набір 8 шт',
      shortDescription: 'Вісім трикутних тістечок у різних обсипках: горіх, кокос, шоколад.',
      description: 'Порційні шматочки торта на паличці — не треба тарілок і виделок. Чотири смаки по два в наборі, обсипка на вибір.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки, горіхи, кокосова стружка, шоколад.',
      allergens: ['gluten', 'milk', 'eggs', 'nuts'], calories: 398,
      badges: ['hit'], holidays: ['dytiache-sviato', 'vesillia'],
      tags: ['тістечка', 'паличка', 'асорті', 'кенді-бар'], orders: 241,
    },
    {
      title: 'Тістечка-кубики, набір 4 шт',
      slug: 'tistechka-kubyky',
      category: 'inshe', price: 360, priceUnit: 'set', size: 'набір 4 шт',
      shortDescription: 'Чотири кубики з кремом усередині: горіх, кокос, шоколад і карамель.',
      description: 'Класичні тістечка у сучасній подачі: ніжний бісквіт, вершковий крем і щільна обсипка. Добре тримаються в дорозі, тому часто беруть в офіс.',
      ingredients: 'Борошно, цукор, яйця, масло, вершки 33%, горіхи, кокос, карамель.',
      allergens: ['gluten', 'milk', 'eggs', 'nuts'], calories: 415,
      tags: ['тістечка', 'кубики', 'офіс', 'асорті'], orders: 176,
    },
  ]

  /**
   * Поки в каталозі лише позиції з реальними фото (apps/web/public/images).
   * Решта товарів лишається в цьому файлі — щоб повернути їх, приберіть фільтр нижче.
   */
  const WITH_PHOTO = new Set([
    'ponchyky-klasychni-nabir-6-sht',
    'keikpopsy-iednorih-nabir-9-sht',
    'keikpops-poshtuchno',
    'keiksykly-shokoladni',
    'tistechka-na-palychtsi',
    'tistechka-kubyky',
    'dytiachyi-tort-pikselnyi-svit',
    'dytiachyi-tort-igrovi-heroi',
    'dytiachyi-tort-ptashky',
  ])

  for (const p of products.filter((item) => item.slug && WITH_PHOTO.has(item.slug))) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        slug: p.slug,
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
        eyebrow: 'Авторська кондитерська в Києві з 2016',
        title: 'Розкажіть про свято',
        titleAccent: 'ми створимо десерт',
        text: 'Створюємо торти та десерти для дитячих і дорослих свят: авторські пончики без фритюру та тематичні кенді-бари під будь-яку подію.',
        primaryLabel: 'Обрати десерт',
        primaryHref: '/katalog',
        secondaryLabel: 'Торт на замовлення',
        secondaryHref: '/torty',
      },
      counters: {
        donuts: 123000, donutsLabel: 'пончиків спекли',
        cakesKg: 7000, cakesLabel: 'кілограмів тортів продали',
        years: 635, yearsLabel: 'пончикових тортів створили',
      },
      variants: {
        title: 'Для якого приводу шукаєте десерт?',
        text: 'Чотири найпопулярніші приводи наших клієнтів. Оберіть свій — або перегляньте весь каталог.',
      },
      bestsellers: {
        title: 'Найчастіше замовляють',
        text: 'Десерти, які наші клієнти обирають знову і знову.',
        limit: 8,
      },
      cta: {
        title: 'Не знайшли свій варіант?',
        text: 'Розкажіть нам про ваше свято — а ми підберемо десерти, оформлення та порахуємо вартість індивідуально, протягом 30 хвилин.',
        buttonLabel: 'Розказати про свято',
        buttonHref: '/kontakty',
      },
      faq: {
        title: 'Питання, які ставлять найчастіше',
        items: [
          { question: 'За скільки днів робити замовлення?', answer: 'Торти рекомендуємо замовляти за 3–5 днів до потрібної дати. Порційні солодощі — брауні, чизкейк-трикутнички, кейк-попси — за 1–2 дні. Пончики можемо приготувати день у день.' },
          { question: 'Чи можна замовити торт терміново, на завтра?', answer: 'Так! Міні-торти та капкейки можна замовити за 24 години. А торт із пончиків — навіть день у день. Напишіть нам дату свята, і ми підкажемо найкращий варіант саме для вас.' },
          { question: 'Як розрахувати вагу торта на кількість гостей?', answer: 'Орієнтир за кількістю гостей: міні-торт 1,2–1,3 кг — 5–6 порцій, стандартний торт 2 кг — 10–12 порцій, ярусний від 4 кг — від 20 і більше порцій. Напишіть нам кількість гостей — підкажемо оптимальний варіант.' },
          { question: 'Чи є доставка та звідки самовивіз?', answer: 'Доставляємо по Києву на таксі — вартість за тарифом. Самовивіз можливий за адресою вул. Дениса Рачінського, 25 (метро Лівобережна) — обирайте зручний варіант.' },
          { question: 'Чи можна відправити солодощі Новою поштою?', answer: 'З вересня по травень відправляємо Новою поштою порційні солодощі: пончики, кекси, брауні, чизкейк-трикутнички, кейк-попси. Торти, капкейки та пончикові торти не відправляємо — вони занадто тендітні для такого транспортування.' },
          { question: 'Що робити, якщо є алергія?', answer: 'Обов’язково повідомте нас під час оформлення замовлення. Усі десерти мають маркування з виділеними алергенами, а на виробництві ми використовуємо окремий інвентар, щоб мінімізувати перехресне забруднення. Напишіть, які продукти не можна — підкажемо варіанти.' },
          { question: 'Як відбувається оплата?', answer: 'Після узгодження всіх деталей замовлення ми надсилаємо реквізити для оплати. Передоплата: до 1000 грн — 100%, від 1000 грн — 50% від суми замовлення. Умови оплати решти суми узгоджуємо індивідуально.' },
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
        address: 'Київ, вул. Дениса Рачінського, 25 (м. Лівобережна)',
        schedule: 'Самовивіз за попереднім замовленням',
      },
      socials: [
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'Telegram', href: 'https://telegram.org' },
        { label: 'Facebook', href: 'https://facebook.com' },
      ],
      footerNote: 'Авторська кондитерська в Києві з 2016 року. Торти, пончики без фритюру та кенді-бари під подію.',
      delivery: [
        { title: 'Доставка по Києву', text: 'таксі, вартість за тарифом' },
        { title: 'Самовивіз', text: 'вул. Дениса Рачінського, 25' },
        { title: 'Торт на замовлення', text: 'за 3–5 днів до дати' },
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
