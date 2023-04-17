'use strict';

const habbits = [];
const habbitKey = 'habbits';

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

(() => {
  loadData();
})();
