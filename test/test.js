// @ts-check

import termimg from '../dist/index.js';

console.log(await termimg('test/cat1.jpg', 30, 30, 'halfblock'));
console.log(await termimg('test/smoke.png', 30, 30, 'block'));
console.error(await termimg('test/cat2.jpg', 30, 30, 'sixel'));