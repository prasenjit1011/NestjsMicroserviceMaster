const promise1 = Promise.resolve('First');
const promise2 = new Promise((resolve) => setTimeout(() => resolve('Second'), 1000));
const promise3 = Promise.resolve('Third');
const promise4 = Promise.reject('Error occurred');



promise1.then((result) => {
  console.log(result); // 'First'
});

Promise.all([promise1, promise2, promise3, promise4])
  .then((results) => {
    console.log(results); // ['First', 'Second', 'Third']
  })
  .catch((error) => {
    console.error(error);
  });