console.clear();
console.log("\n\n -: Starting debounce test at", new Date().toLocaleTimeString(), ' :-');

function callApi(param) {
  console.log(' -: Debounce Function :',new Date().toLocaleTimeString(),' : ', param, ' \n\n\n');
}

function debounce(delay) {
  let timer;
  return (str) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callApi(str);
    }, delay);
  };
}

const debouncedPrint = debounce(5000);
debouncedPrint(`Call 1`);
debouncedPrint(`Call 2`);
debouncedPrint(`Call 3`);
debouncedPrint(`Call 4`);

