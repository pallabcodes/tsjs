interface User {
  id: number;
  name: string;
  address: { street: string; city: string; country: string };
}
export type City = User['address']['city'];
export type IdOrName = User['id' | 'name'];
export type UserId = User['id'];
export type UserAddress = User['address'];

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function updateAddress(_id: UserId, _newAddress: User['address']) {}

type UserProperties = keyof User;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let userProperties: UserProperties;

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = { title: 'Fifa', rating: 8 };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const title = getProperty(user, 'title');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rating = getProperty(user, 'rating');

// eslint-disable-next-line @typescript-eslint/no-empty-function
document.addEventListener('click', _event => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
document.addEventListener('keypress', _event => {});

interface MyMouseEvent {
  x: number;
  y: number;
}
interface MyKeyboardEvent {
  key: string;
}

interface MyEventObjects {
  click: MyMouseEvent;
  keypress: MyKeyboardEvent;
}

function handleEvent<K extends keyof MyEventObjects>(
  eventName: K,
  callback: (e: MyEventObjects[K]) => void
) {
  // by doing MyEventObjects[K] same as MyEventObjects[keyof MyEventObjects] =
  //  MyMouseEvent | MyKeyboardEvent; thus whether given value is {x: 1, y: 1}/{key: "Enter"}
  // it doesn't throw error since it satisfies one of these MyMouseEvent | MyKeyboardEvent

  if (eventName === 'click') {
    callback({ x: 1, y: 1 } as MyEventObjects[K]);
  } else if (eventName === 'keypress') {
    callback({ key: 'Enter' } as MyEventObjects[K]);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
handleEvent('click', _event => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
handleEvent('keypress', _event => {});

export type MyEventKeys = keyof MyEventObjects; // 'click' | 'keypress'
export type MyEvents = MyEventObjects[keyof MyEventObjects]; // MyMouseEvent | MyKeyboardEvent
