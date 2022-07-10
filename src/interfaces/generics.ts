interface Game<T> {
  id: number | string;
  prop: T;
  method: (...args: any[]) => void;
  released: string;
}

interface ESports {
  title: string;
  released: number;
}

// Extending the multiple interfaces
// interface Gamers extends Game<boolean>, ESports { venue: string }

interface Form<T> {
  values: T;
  errors: { [K in keyof T]?: string };
}

const contactForm: Form<{ name: string; email: string, mobile: string }> = {
  values: {
    name: "Bob",
    email: "bob@someemail.com",
    mobile: "8670364441"
  },
  errors: {
    email: "invalid email address entered"
  }
};
