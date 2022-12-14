enum Status {
  Pending,
  FullFilled,
  Success,
  Rejected,
  NetworkError
}

// # string enums
enum Language {
  React = `React`,
  Angular = `Angular`,
  Node = `Node`,
  Next = `Next`,
  Nest = `Nest`,
}

type MappingLanguage = {
  [Property in Language as `${Capitalize<Property>}`]: string
}

type UsingMapped = MappingLanguage; // {React: string; Angular: string; Node: string; Next: string; Nest: string;}
