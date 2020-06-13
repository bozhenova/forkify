import Search from './js/models/Search';
import * as searchView from './js/views/searchView';
import * as recipeView from './js/views/recipeView';
import * as listView from './js/views/listView';
import * as likesView from './js/views/likesView';
import { elements, renderLoader, clearLoader } from './js/views/base';
import Recipe from './js/models/Recipe';
import List from './js/models/List';
import Likes from './js/models/Likes';
import './style.css';
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      await state.search.getResults();
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(err);
      alert('Something is wrong with the search...');
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchRes.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if (state.search) searchView.highlightSelected(id);

    state.recipe = new Recipe(id);
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert('Error processing recipe');
    }
  }
};

['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

const controlList = () => {
  if (!state.list) state.list = new List();
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
  listView.renderButton();
};

elements.shoppingList.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

elements.shopping.addEventListener('click', e => {
  if (e.target.closest('.shopping__clear-button')) {
    e.preventDefault();
    state.list.clearList();
    listView.clearList();
    listView.deleteButton();
  }
});

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.toggleLikeBtn(true);
    likesView.renderLike(newLike);
  } else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load', () => {
  state.list = new List();
  state.likes = new Likes();
  state.likes.getData();
  state.list.getData();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach(likesView.renderLike);
  state.list.items.forEach(listView.renderItem);
  state.list.items.length > 0 && listView.renderButton();
});

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    !elements.shoppingList.hasChildNodes() && controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});
