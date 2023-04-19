'use strict';

const habbits = [];
const habbitKey = 'habbits';

/* page */
const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  body: document.querySelector('.habbits'),
  popup: document.getElementById('add-habbit-popup')
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

function deleteDay(e, habbit, day) {
  let counter = 0;
  for (const existDay of habbit.days) {
    if (day === existDay) {
      habbit.days.splice(counter, 1);
      saveData();
      renderBody(habbit);
      renderHead(habbit);
      return;
    }
    counter++;
  }
}

function createNewDay(e, habbit, inputElement) {
  e.preventDefault();  
  const text = inputElement.value;
  if (!text) {
    console.log('No text');
    return;
  }
  habbit.days.push({ comment: text });
  saveData();
  inputElement.value = '';
  renderBody(habbit);
  renderHead(habbit);
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

function renderHead(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length * 100) / activeHabbit.target;
  page.header.progressPercent.innerText = progress.toFixed(0) + '%';
  page.header.progressCoverBar.setAttribute(
    'style',
    `width: ${progress.toFixed(2)}%`
  );
}

function renderBody(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.body.innerHTML = '';
  let counter = 1;
  for (const day of activeHabbit.days) {
    const element = createRowElement(activeHabbit, day, counter);
    page.body.appendChild(element);
    counter++;
  }
  const addNewDayElement = createNewDayRowElement(counter, activeHabbit);
  page.body.appendChild(addNewDayElement);
}

function createNewDayRowElement(dayNumber, habbit) {
  const element = document.createElement('div');
  element.classList.add('habbit');
  const dayElement = document.createElement('div');
  dayElement.classList.add('habbit__day');
  dayElement.innerText = 'Day ' + dayNumber;
  element.appendChild(dayElement);
  const formElement = document.createElement('form');
  formElement.classList.add('habbit__form');
  element.appendChild(formElement);

  const inputElement = document.createElement('input');
  inputElement.classList.add('input_icon');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('placeholder', 'Add new comment...');
  formElement.appendChild(inputElement);

  const iconElement = document.createElement('img');
  iconElement.classList.add('input__icon');
  iconElement.setAttribute('src', './images/comment.svg');
  iconElement.setAttribute('alt', 'Comment icon');
  formElement.appendChild(iconElement);

  const submitElement = document.createElement('button');
  submitElement.classList.add('form__button');
  submitElement.innerText = 'Save';
  submitElement.addEventListener('click', (e) => {
    createNewDay(e, habbit, inputElement);
  });
  formElement.appendChild(submitElement);

  return element;
}

function createRowElement(habbit, day, dayNumber) {
  const element = document.createElement('div');
  element.classList.add('habbit');
  const dayElement = document.createElement('div');
  dayElement.classList.add('habbit__day');
  dayElement.innerText = 'Day ' + dayNumber;
  element.appendChild(dayElement);
  const commentElement = document.createElement('div');
  commentElement.classList.add('habbit__comment');
  commentElement.innerText = day.comment;
  element.appendChild(commentElement);
  const deleteElement = document.createElement('div');
  deleteElement.classList.add('habbit__delete');
  const deleteIconElement = document.createElement('img');
  deleteIconElement.setAttribute('src', './images/delete.svg');
  deleteIconElement.setAttribute('alt', 'Delete day');
  deleteIconElement.addEventListener('click', (e) => {
    deleteDay(e, habbit, day);
  });
  deleteElement.appendChild(deleteIconElement);
  element.appendChild(deleteElement);
  return element;
}

function render(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  renderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderBody(activeHabbit);
}

function togglePopup() {
  if (page.popup.classList.contains('cover_hidden')) {
    page.popup.classList.remove('cover_hidden');
  } else {    
    page.popup.classList.add('cover_hidden');
  }
}

/* init */
(() => {
  loadData();
  if (habbits) {
    render(habbits[0].id);
  }
})();
