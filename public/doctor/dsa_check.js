

console.clear();
let lineNum = 0;
async function consoleLine(str = 'DSA'){
  lineNum++;
  await console.log('\n====================== '+lineNum+' '+str+' =======================================================\n');
}

consoleLine(' -: App Started :- '+ (new Date).toLocaleTimeString());


Promise.resolve().then(() => {
  for(let i=0; i<5; i++){
    setTimeout(()=>{console.log(i)},i*1000)
  }
})
.then(()=>{


consoleLine();

const arr2 = [1, 2, 3];
const data = arr2.map((num) => {
  if (num > 1) return;
  return num * 2;
});
console.log(data)

consoleLine();


async function foo() {
  console.log("A");
  await bar();
  console.log("B");
}
async function bar() {
  console.log("C");
}

console.log("D");
foo();
Promise.resolve().then(() => console.log("E"));
console.log("F");

})
.then(()=>{

consoleLine();

console.log("Start");
setTimeout(() => console.log("Timeout1"), 0); // 
Promise.resolve().then(() => {
  console.log("Promise1");
  setTimeout(() => console.log("Timeout2"), 0); // Phase 
});
 
Promise.resolve().then(() => console.log("Promise2"));
 
console.log("End");
  
});
