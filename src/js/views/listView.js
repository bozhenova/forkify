import { elements } from './base';

export const renderItem = item => {
  const markup = `
      <li class="shopping__item" data-itemid="${item.id}">
          <div class="shopping__count">
              <input type="number" value="${item.count}" min="0" step="${item.count}" class="shopping__count-value">
              <p>${item.unit}</p>
          </div>
          <p class="shopping__description">${item.ingredient}</p>
          <button class="shopping__delete btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-cross"></use>
              </svg>
          </button>
      </li>`;

  elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const renderButton = () => {
  const markup = `
      <button class="btn shopping__clear-button">
        <span>Clear list</span>
      </button>`;
  elements.shoppingList.insertAdjacentHTML('afterend', markup);
};

export const deleteItem = id => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if (item) item.remove();
};

export const clearList = () => {
  elements.shoppingList.innerHTML = '';
};

export const deleteButton = () => {
  const button = document.querySelector('.shopping__clear-button');
  button.remove();
};
