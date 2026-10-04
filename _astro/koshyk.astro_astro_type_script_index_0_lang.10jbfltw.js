import{c as e,i as t,n,r,s as i}from"./store.JIMqTPGf.js";import{t as a}from"./url.D1efudt3.js";var o={kg:`за кг`,pcs:`за шт`,set:`за набір`},s={cake:`🎂`,donut:`🍩`,cakepop:`🍭`,other:`🎁`},c=150,l=1500,u=e=>`${new Intl.NumberFormat(`uk-UA`).format(e)} ₴`,d=()=>{let e=t(),r=document.querySelector(`[data-cart-empty]`),i=document.querySelector(`[data-cart-content]`);if(r.hidden=e.length>0,i.hidden=e.length===0,e.length===0)return;document.querySelector(`[data-cart-items]`).innerHTML=e.map(e=>`
        <article class="card flex gap-3 p-3 sm:gap-4 sm:p-4">
          <a href="${a(`/tovar/${e.slug}`)}" class="grid size-20 shrink-0 place-items-center rounded-xl bg-primary-soft text-3xl sm:size-24">${s[e.shape||`cake`]||`🍰`}</a>
          <div class="flex flex-1 flex-col">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold leading-snug"><a href="${a(`/tovar/${e.slug}`)}" class="hover:text-primary">${e.title}</a></h3>
                <p class="mt-0.5 text-xs text-navy-soft">${u(e.price)} ${o[e.unit]||``}</p>
              </div>
              <button type="button" class="text-navy-soft transition hover:text-primary" data-remove="${e.id}" aria-label="Видалити">✕</button>
            </div>
            <div class="mt-auto flex items-center justify-between gap-3 pt-3">
              <div class="flex items-center rounded-full border border-navy/12">
                <button type="button" class="grid size-9 place-items-center text-lg text-navy-soft hover:text-primary" data-dec="${e.id}">−</button>
                <span class="w-8 text-center text-sm font-bold">${e.qty}</span>
                <button type="button" class="grid size-9 place-items-center text-lg text-navy-soft hover:text-primary" data-inc="${e.id}">+</button>
              </div>
              <span class="text-lg font-extrabold">${u(e.price*e.qty)}</span>
            </div>
          </div>
        </article>`).join(``);let d=n(),f=d>=l?0:c;document.querySelector(`[data-cart-subtotal]`).textContent=u(d),document.querySelector(`[data-cart-delivery]`).textContent=f===0?`безкоштовно`:u(f),document.querySelector(`[data-cart-total]`).textContent=u(d+f),document.querySelector(`[data-cart-hint]`).textContent=f===0?`Доставка безкоштовна — сума понад 1500 ₴`:`Ще ${u(l-d)} до безкоштовної доставки`};document.addEventListener(`click`,n=>{let a=n.target.closest(`[data-remove],[data-inc],[data-dec],[data-clear-cart],[data-checkout]`);if(a){if(a.dataset.remove&&i(Number(a.dataset.remove)),a.dataset.inc){let n=t().find(e=>e.id===Number(a.dataset.inc));n&&e(n.id,n.qty+1)}if(a.dataset.dec){let n=t().find(e=>e.id===Number(a.dataset.dec));n&&e(n.id,Math.max(1,n.qty-1))}a.hasAttribute(`data-clear-cart`)&&r(),a.hasAttribute(`data-checkout`)&&alert(`Демо-версія: оформлення замовлення та оплата у цій збірці не підключені.`)}}),document.addEventListener(`store:change`,d),d();