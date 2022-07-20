// fetch method returns a promise

const headers = {
  "Content-Type": "applications/json"
};

fetch(`http://localhost:8080`, {
  headers,
  method: "GET",
  cache: "only-if-cached",
  mode: "cors"
}).then(r => r);


try {
  // abort a fetch request explicitly or after timout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const response = await fetch(url, { signal: controller.signal });
  const body = await response.json();

  // const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
  // const result = await response.blob();
} catch (error) {
  if (error.name === "TimeoutError") {
    console.log(error + "timeout error");
  } else if (error.name === "AbortError") {
    console.log(error + "abort error");
  } else {
    console.log(error);
  }
} finally {
  clearTimeout(timeoutId);
}

const fetchController = new AbortController();

async function getData(url = "https://jsonplaceholder.typicode.com/users", options = {}) {
  try {
    // only if data is not here within 5000ms then abort
    // const within = setTimeout(() => abort(), 2500);
    const response = await fetch(url, { signal: fetchController.signal });
    const { data } = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

// GET
async function fetchUsers(url, { method, ...options } = {}) {
  try {
    const users = await fetch(url, { method: "GET" });
    return await user.json();
  } catch (e) {
    console.log(e);
  }
}

async function updateUser(url, payload) {
  await fetch(url, { method: "POST", body: JSON.stringify(payload), headers, cache: "no-cache" });
}
