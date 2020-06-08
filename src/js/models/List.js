import uniqId from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqId(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    this.saveData();
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    this.items.splice(index, 1);
    this.saveData();
  }

  updateCount(id, newCount) {
    this.items.find(elem => elem.id === id).count = newCount;
  }

  saveData() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  getData() {
    const storage = JSON.parse(localStorage.getItem('items'));
    if (storage) this.items = storage;
  }

  clearList() {
    this.items = [];
    this.saveData();
  }
}
