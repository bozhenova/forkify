export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    this.saveData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(item => item.id === id);
    this.likes.splice(index, 1);
    this.saveData();
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  saveData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  getData() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if (storage) this.likes = storage;
  }
}
