import fs from 'fs';

const storeFile = 'queue.json';

export function save(tasks: any[]) {
  fs.writeFileSync(storeFile, JSON.stringify(tasks, null, 2));
}

export function load(): any[] {
  if (!fs.existsSync(storeFile)) return [];
  return JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
}
