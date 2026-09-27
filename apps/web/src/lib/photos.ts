/**
 * Демо-фото товарів із `public/images`. Сайт статичний, тому картинки лежать у репозиторії,
 * а не в CMS: завантажене у Payload фото віддається за localhost-адресою й на GitHub Pages не відкриється.
 * Щойно з'явиться публічний медіа-хостинг — цей файл можна прибрати, поле «Фото» в CMS має пріоритет.
 */
const PRODUCT_PHOTOS: Record<string, string> = {
  'ponchyky-klasychni-nabir-6-sht': '/images/ponchyky-klasychni-nabir-6-sht.jpg',
  'keikpopsy-iednorih-nabir-9-sht': '/images/keikpopsy-iednorih-nabir-9-sht.jpg',
  'keikpops-poshtuchno': '/images/keikpops-poshtuchno.jpg',
  'keiksykly-shokoladni': '/images/keiksykly-shokoladni.jpg',
  'tistechka-na-palychtsi': '/images/tistechka-na-palychtsi.jpg',
  'tistechka-kubyky': '/images/tistechka-kubyky.jpg',
  'dytiachyi-tort-pikselnyi-svit': '/images/dytiachyi-tort-pikselnyi-svit.jpg',
  'dytiachyi-tort-igrovi-heroi': '/images/dytiachyi-tort-igrovi-heroi.jpg',
  'dytiachyi-tort-ptashky': '/images/dytiachyi-tort-ptashky.jpg',
}

export const photoFor = (slug?: string): string | undefined => (slug ? PRODUCT_PHOTOS[slug] : undefined)
