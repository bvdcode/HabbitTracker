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
  popup: {
    form: document.querySelector('.popup__form'),
    window: document.getElementById('add-habbit-popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]'),
  },
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
  if (text.toLowerCase() == 'delete habbit') {
    let counter = 0;
    for (const h of habbits) {
      if (h.id === habbit.id) {
        habbits.splice(counter, 1);
        saveData();
        window.location.reload();
        return;
      }
      counter++;
    }
    return;
  }
  habbit.days.push({ comment: text });
  saveData();
  inputElement.value = '';
  renderBody(habbit);
  renderHead(habbit);
}

function createHabbit(event) {
  event.preventDefault();
  const form = page.popup.form;
  const data = new FormData(form);
  const name = data.get('name');
  const icon = data.get('icon');
  const target = data.get('target');
  if (!name || !icon || target < 1) {
    return;
  }
  const id =
    habbits.length > 0
      ? 1 +
        habbits.reduce((acc, habbit) => (acc > habbit.id ? acc : habbit.id), 0)
      : 1;
  if (!Number.isInteger(id)) {
    console.log('Max id is not a number: ' + id);
    return;
  }
  const newHabbit = {
    days: [],
    name,
    icon,
    target,
    id,
  };
  habbits.push(newHabbit);
  saveData();
  form['name'].value = '';
  form['target'].value = 0;
  togglePopup();
  render(newHabbit.id);
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
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
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
  document.location.replace(document.location.pathname + '#' + activeHabbitId);
  renderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderBody(activeHabbit);
}

function togglePopup() {
  if (page.popup.window.classList.contains('cover_hidden')) {
    page.popup.window.classList.remove('cover_hidden');
  } else {
    page.popup.window.classList.add('cover_hidden');
  }
}

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector('.icon.icon_active');
  if (activeIcon) {
    activeIcon.classList.remove('icon_active');
  }
  context.classList.add('icon_active');
}

/* init */
(() => {
  loadData();
  if (habbits.length == 0) {
    return;
  }
  const hashId = Number(document.location.hash.replace('#', ''));
  const urlHabbit = habbits.find((h) => h.id == hashId);
  if (urlHabbit) {
    render(urlHabbit.id);
  } else {
    render(habbits[0].id);
  }
})();
