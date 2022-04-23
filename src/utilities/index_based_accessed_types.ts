interface User {
  id: number;
  name: string;
  address: { street: string; city: string; country: string };
}
type City = User["address"]["city"];
type IdOrName = User["id" | "name"];
type UserId = User["id"];
type UserAddress = User["address"];

function updateAddress(id: UserId, newAddress: User["address"]) {}

type UserProperties = keyof User;
let userProperties: UserProperties;

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let user = { title: "Fifa", rating: 8 };
const title = getProperty(user, "title");
const rating = getProperty(user, "rating");

document.addEventListener("click", (e) => {});
document.addEventListener("keypress", (e) => {});

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
  // it doesn't throw error since it satisifes one of these MyMouseEvent | MyKeyboardEvent

  if (eventName === "click") {
    callback({ x: 1, y: 1 } as MyEventObjects[K]);
  } else if (eventName === "keypress") {
    callback({ key: "Enter" } as MyEventObjects[K]);
  }
}

handleEvent("click", (e) => {});
handleEvent("keypress", (e) => {});
type MyEventKeys = keyof MyEventObjects; // 'click' | 'keypress'
type MyEvents = MyEventObjects[keyof MyEventObjects]; // MyMouseEvent | MyKeyboardEvent
