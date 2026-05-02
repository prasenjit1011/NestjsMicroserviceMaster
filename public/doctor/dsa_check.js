console.clear();
const arr = [[1, 2], [3, 4], [5]];

const flat = arr.reduce((acc, curr) => acc.concat(curr), []);

console.log(flat); // [1, 2, 3, 4, 5]
