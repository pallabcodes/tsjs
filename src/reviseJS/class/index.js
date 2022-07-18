// class, getter, setter, modifiers, inheritance, encapsulation, polymorphism, abstraction
// this is a syntatic sugar/easier way to do a make prototype & prototypal inheritance

class Movies {
  #title = `Good movies`;

  set movieTitle(title) {
    this.#title = title;
  }
}

const movies = new Movies();
movies.movieTitle = "Great Movie";

class Genre extends Movies {}
