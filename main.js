'use strict';
const template = `
<main>
<div class="header">
    <div class="date">
    <p class="date__day">${day}<p>
    <div class="date__my">
    <p>${month}</p>
    <p>${year}</p>
    </div>
    </div>
    <div class="weekday">
    <p>${weekDay}</p>
    </div>
</div>
    <ul class="list">
    </ul>
    <section class="completed">
    <p class="finished_prompt"></p>
    <ul class="finished_list">
    </ul>
    </section>
    <div class="addContainer">
    <button class="btn btn-add"><img class="icon icon-add" src="/icons/add.png"></button>
    </div>
    <div class="popup"></div>
    </main>
`;
document.body.innerHTML = template;

const submitButton = document.querySelector('.input_form__button');
const addButton = document.querySelector('.btn-add');
const addContainer = document.querySelector('.addContainer');
const userPrompt = document.querySelector('.user_prompt');
const list = document.querySelector('.list');
const listCards = document.querySelectorAll('.list__card');
const finishedList = document.querySelector('.finished_list');
const items = JSON.parse(localStorage.getItem('listItem'));
const finishedItems = JSON.parse(localStorage.getItem('finishedItem'));
const finishedPrompt = document.querySelector('.finished_prompt');
const popup = document.querySelector('.popup');

let chores = [];
let comparer = [];
let finished = [];
let errors = [];

addButton.addEventListener('click', e => {
  addButton.disabled = true;

  const inputForm = document.createElement('form');
  const label = document.createElement('label');
  const taskInputField = document.createElement('input');
  const taskSubmitButton = document.createElement('button');
  const prompt = document.createElement('h1');

  //ändra till appendItems funktion?
  createPopup(inputForm, label, taskInputField, taskSubmitButton, prompt);

  inputForm.addEventListener('submit', function(event) {
    if (taskInputField.value.trim() === '') {
      errors.push(`This field can't be left empty`);
      displayErrorMessage();
    } else {
      event.preventDefault();
      insertNewItem(taskInputField, chores, 'listItem');
      deletePopup(popup, inputForm, taskInputField, taskSubmitButton);

      addButton.disabled = false;

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
          deleteStoredItem(chores, cardText, 'listItem');
        });
      });

      editButtonHandler();
      doneButtonHandler();
    }
  });
});

if (items === null || Object.entries(items).length === 0) {
  console.log('Add new chore');
} else {
  localStorage.setItem('listItem', JSON.stringify(items));
  chores = JSON.parse(localStorage.getItem('listItem'));
  items.forEach(item => {
    list.innerHTML += `<div class="list__card">
    <div class="card__container">
    <button class="btn btn-done"><img class="icon" src="/icons/notdone.png"></button> 
    <li class="card__item">${item}</li>
    </div>
    <div class="item__buttons">
    <button class="btn btn-edit"><img class="icon" src="/icons/edit.png"></button>
    <button class="btn btn-delete"><img class="icon" src="/icons/delete.svg"></button>
    </div>
    </div>`;
  });

  const deleteButtons = document.querySelectorAll('.btn-delete');

  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', e => {
      const card = deleteButton.closest('.list__card');
      const cardText = card.childNodes[1].childNodes[3].innerText;

      deleteElement(card);
      deleteStoredItem(chores, cardText, 'listItem');
    });
  });

  doneButtonHandler();
  editButtonHandler();
}

if (finishedItems === null || Object.entries(finishedItems).length === 0) {
  console.log('Nothing done');
} else {
  localStorage.setItem('finishedItem', JSON.stringify(finishedItems));
  finished = JSON.parse(localStorage.getItem('finishedItem'));
  finishedItems.forEach(finishedItem => {
    finishedList.innerHTML += `<div class="list__card">
    <div class="card__container">
    <button class="btn btn-regret"><img class="icon" src="/icons/confirm.svg"></button> 
    <li class="card__item">${finishedItem}</li>
    </div>
    <div class="item__buttons">
    <button class="btn btn-delete_finished"><img class="icon" src="/icons/delete.svg"></button>
    </div>
    </div>`;
  });

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
}
