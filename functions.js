'use strict';

function displayErrorMessage() {
  errors.forEach(error => {
    window.alert(error);
  });

  errors = [];
}

function insertNewItem(input, array, item) {
  if (typeof input === 'object') {
    array.push(input.value);
    input.value = '';
    localStorage.setItem(item, JSON.stringify(array));
  } else if (typeof input === 'string') {
    array.push(input);
    localStorage.setItem(item, JSON.stringify(array));
  }
}

function getStoredItems(item) {
  const items = JSON.parse(localStorage.getItem(item));
  return items;
}

function deleteStoredItem(array, text, item) {
  array.splice(array.indexOf(text), 1);
  localStorage.setItem(item, JSON.stringify(array));
}

function replaceStoredItem(array, text, newText, item) {
  array.splice(array.indexOf(text), 1, newText);
  localStorage.setItem(item, JSON.stringify(array));
}

function deleteElement(element) {
  element.remove();
}

function deleteCard(text, array, item) {
  const cardItemIndex = array.indexOf(text);
  deleteStoredItem(array, cardItemIndex, item);
}

function disableButtons(buttons) {
  buttons.forEach(button => {
    button.disabled = true;
  });
}

function enableButtons(buttons) {
  buttons.forEach(button => {
    button.disabled = false;
  });
}

function enableButtons(buttons) {
  buttons.forEach(button => {
    button.disabled = false;
  });
}
function addClass(element, className) {
  element.classList.add(className);
}

function setAttributes(element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function appendChildren(element, children) {
  children.forEach(child => {
    element.appendChild(child);
  });
}

function createPopup(form, label, input, button, prompt) {
  addClass(popup, 'active');
  addClass(form, 'input_form');
  addClass(input, 'input_form__input');
  addClass(button, 'input_form__button');

  button.innerText = 'Add';
  prompt.innerText = 'Add new task: ';

  label.setAttribute('for', 'input_form__input');
  button.setAttribute('type', 'submit');
  setAttributes(input, { type: 'text', name: 'input_for__input' });

  appendChildren(form, [prompt, label, input, button]);
  popup.appendChild(form);
  addContainer.appendChild(popup);
}

function deletePopup(div, form, input, button) {
  deleteElement(div);
  deleteElement(form);
  deleteElement(input);
  deleteElement(button);
}

function editButtonHandler() {
  const deleteButtons = document.querySelectorAll('.btn-delete');
  const editButtons = document.querySelectorAll('.btn-edit');
  const doneButtons = document.querySelectorAll('.btn-done');

  editButtons.forEach(editButton => {
    editButton.addEventListener('click', e => {
      //disables the rest of the buttons during edit mode
      disableButtons(deleteButtons);
      disableButtons(editButtons);
      disableButtons(doneButtons);
      // disableButtons(...deleteButtons, ...editButtons, ...doneButtons);

      const card = editButton.closest('.list__card');
      const cardItem = card.childNodes[1].childNodes[3];
      const cardItemText = cardItem.innerText;

      insertNewItem(cardItemText, comparer, 'comparerItem');

      comparer = getStoredItems('comparerItem');

      const comparerItem = comparer[0];

      const editField = document.createElement('input');
      addClass(editField, 'input');

      const confirmButton = document.createElement('button');

      addClass(confirmButton, 'btn-confirm');

      const confirmIcon = document.createElement('img');
      confirmIcon.setAttribute('src', '/icons/confirm.svg');
      addClass(confirmIcon, 'icon');
      confirmButton.appendChild(confirmIcon);

      editButton.parentNode.replaceChild(confirmButton, editButton);
      cardItem.parentNode.replaceChild(editField, cardItem);

      const confirmButtons = document.querySelectorAll('.btn-confirm');

      confirmButtons.forEach(confirmButton => {
        confirmButton.addEventListener('click', e => {
          if (editField.value.trim() === '') {
            errors.push(`This field can't be left empty`);
            displayErrorMessage();
          } else {
            const newValue = editField.value;
            card.childNodes[1].replaceChild(cardItem, editField);
            cardItem.innerHTML = newValue;
            confirmButton.parentNode.replaceChild(editButton, confirmButton);

            replaceStoredItem(chores, comparerItem, newValue, 'listItem');
            localStorage.removeItem('comparerItem');

            comparer = [];

            //enables the rest of the buttons after edit mode
            enableButtons(deleteButtons);
            enableButtons(editButtons);
            enableButtons(doneButtons);
          }
        });
      });
    });
  });
}

function doneButtonHandler() {
  const doneButtons = document.querySelectorAll('.btn-done');

  doneButtons.forEach(doneButton => {
    doneButton.addEventListener('click', e => {
      finishedPrompt.innerHTML = '';

      const card = doneButton.parentNode.closest('.list__card');

      const cardItemText = card.childNodes[1].childNodes[3].innerText;

      insertNewItem(cardItemText, finished, 'finishedItem');

      deleteElement(card);

      deleteStoredItem(chores, cardItemText, 'listItem');

      finishedList.innerHTML += `<div class="list__card">
      <div class="card__container">
      <button class="btn btn-regret"><img class="icon" src="/icons/confirm.svg"></button>
      <li class="card__item">${getStoredItems('finishedItem').pop()}</li>
      </div>
      <div class="item__buttons">
      <button class="btn btn-delete_finished"><img class="icon" src="/icons/delete.svg"></button>
      </div>
      </div>`;

      const deleteButtons = document.querySelectorAll('.btn-delete_finished');

      const regretButtons = document.querySelectorAll('.btn-regret');

      regretButtonHandler(regretButtons);

      deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', e => {
          const card = deleteButton.closest('.list__card');
          const cardText = card.childNodes[1].childNodes[3].innerText;

          deleteElement(card);
          deleteStoredItem(finished, cardText, 'finishedItem');
        });
      });
    });
  });
}

function regretButtonHandler(buttons) {
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      const card = button.closest('.list__card');
      const cardItem = card.childNodes[1].childNodes[3];
      const cardItemText = cardItem.innerText;

      insertNewItem(cardItemText, chores, 'listItem');

      deleteElement(card);

      deleteStoredItem(finished, cardItemText, 'finishedItem');

      list.innerHTML += `<div class="list__card">
    <div class="card__container">
    <button class="btn btn-done"><img class="icon" src="/icons/notdone.png"></button> 
    <li class="card__item">${getStoredItems('listItem').pop()}</li>
    </div>
    <div class="item__buttons">
    <button class="btn btn-edit"><img class="icon" src="/icons/edit.png"></button>
    <button class="btn btn-delete"><img class="icon" src="/icons/delete.svg"></button>
    </div>
    </div>`;

      const deleteButtons = document.querySelectorAll('.btn-delete');

      deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', e => {
          const card = deleteButton.closest('.list__card');
          const cardText = card.childNodes[1].childNodes[3].innerText;

          deleteElement(card);
          deleteStoredItem(chores, cardItemText, 'listItem');
        });
      });

      doneButtonHandler();
      editButtonHandler();
    });
  });
}
