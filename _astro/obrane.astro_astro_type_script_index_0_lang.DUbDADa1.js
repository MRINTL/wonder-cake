import{a as e,o as t,t as n}from"./store.JIMqTPGf.js";import{t as r}from"./url.D1efudt3.js";var i={kg:`за кг`,pcs:`за шт`,set:`за набір`},a={cake:`🎂`,donut:`🍩`,cakepop:`🍭`,other:`🎁`},o=e=>`${new Intl.NumberFormat(`uk-UA`).format(e)} ₴`,s=()=>{let t=e();document.querySelector(`[data-fav-empty]`).hidden=t.length>0,document.querySelector(`[data-fav-items]`).innerHTML=t.map(e=>`
        <article class="card flex gap-3 p-3 sm:p-4">
          <a href="${r(`/tovar/${e.slug}`)}" class="grid size-20 shrink-0 place-items-center rounded-xl bg-accent-soft text-3xl">${a[e.shape||`cake`]||`🍰`}</a>
          <div class="flex flex-1 flex-col">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-bold leading-snug"><a href="${r(`/tovar/${e.slug}`)}" class="hover:text-primary">${e.title}</a></h3>
              <button type="button" class="text-navy-soft hover:text-primary" data-unfav="${e.id}" aria-label="Прибрати">✕</button>
            </div>
            <p class="mt-0.5 text-xs text-navy-soft">${o(e.price)} ${i[e.unit]||``}</p>
            <button type="button" class="btn btn-primary mt-auto py-2.5 text-sm" data-fav-cart='${JSON.stringify(e)}'>У кошик</button>
          </div>
        </article>`).join(``)};document.addEventListener(`click`,e=>{let r=e.target.closest(`[data-unfav],[data-fav-cart]`);r&&(r.dataset.unfav&&t(Number(r.dataset.unfav)),r.dataset.favCart&&n(JSON.parse(r.dataset.favCart)))}),document.addEventListener(`store:change`,s),s();