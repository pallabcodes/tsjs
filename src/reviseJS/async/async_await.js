// async/await is a static sugar over Native promises and this makes code synchronous looking

function httpError(response) {
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
}

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
    );
    if (!response.ok) throw Error(`HTTP error: ${response.status}`);
    // if(!response.ok) {
    //   httpError(response);
    //   return;
    // }
    const data = await response.json();
    console.log(data[0].name);
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

fetchProducts().then((data) => console.log(data));

function sleep() {
  // this will still return a Promise{<fullfilled: "sleeping">}
  return new Promise((resolve) => resolve("sleeping"));
  // this will still return a Promise{<fullfilled: undefined>}
  return new Promise((resolve) => resolve("sleeping")).then(response => console.log(response));
}

const handleButton = () => {
  const sleep = Promise.resolve("sleeping").then((result) => console.log("result", result));
  // since Promise resolved, so to get the value, use .then() and now sleep = Promise<fullfilled: undefined>
  // so, if i return sleep here its value now Promose<fullfilled: undefined>
  return sleep;
};

// this is a valid option (if needed): await fetchTodos().then()/.catch()
