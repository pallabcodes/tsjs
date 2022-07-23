// ## debounce
function debounce(fn: Function, delay: number) {
  let id!: number;
  console.log(`initial loaded id is ${id}`);
  return (...args: any[]) => {
    console.log(`previous id is ${id}`);
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// ## throttle
function throttle(fn: Function, delay: number) {
  let lastTime: number = 0;
  console.log(`called the throttle at once`);
  let id: number = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    id++;
    if(now - lastTime < delay) return;
    lastTime = now;
    console.log(`event id id ${id}`);
    fn(...args);
  };
}
