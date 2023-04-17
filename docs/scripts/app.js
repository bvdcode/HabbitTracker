'use strict';

const habbits = [];
const habbitKey = 'habbits';

/* page */
const page = {
  menu: document.querySelector('.menu__list'),
};

/* utils */
function loadData() {
  habbits.length = 0;
  const json = localStorage.getItem(habbitKey);
  try {
    const habbitArray = JSON.parse(json);
    if (Array.isArray(habbitArray)) {
      habbitArray.forEach((habbit) => habbits.push(habbit));
    }
  } catch {}
}

function saveData() {
  localStorage.setItem(habbitKey, JSON.stringify(habbits));
}

/* render */
function renderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const exists = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!exists) {
      const element = document.createElement('button');
      element.setAttribute('menu-habbit-id', habbit.id);
      element.classList.add('menu__item');
      element.addEventListener('click', () => {
        render(habbit.id);
      });
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="{Habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add('menu__item_active');
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      exists.classList.add('menu__item_active');
    } else {
      exists.classList.remove('menu__item_active');
    }
  }
}

function render(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  renderMenu(activeHabbit);
}

/* init */
(() => {
  loadData();
  if (habbits) {
    render(habbits[0].id);
  }
})();
