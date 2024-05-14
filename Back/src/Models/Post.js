class Post {
  constructor(title, description, date, jwt) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.jwt = jwt;
  }
}

module.exports = { Post };
