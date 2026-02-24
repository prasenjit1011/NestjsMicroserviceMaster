const myPromise = new Promise((resolve, reject) => {
  // Simulate async operation
  setTimeout(() => {
    const success = true; // Change to false to test rejection
    if (success) {
      resolve('Operation was successful!');
    } else {
      reject('Operation failed.');
    }
  }, 1000);
});

myPromise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });