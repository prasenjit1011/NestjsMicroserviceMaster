
console.clear();
let lineNum = 0;
async function consoleLine(str = 'DSA'){
  lineNum++;
  await console.log('\n====================== '+lineNum+' '+str+' =======================================================\n');
}

consoleLine(' -: App Started :- '+ (new Date).toLocaleTimeString());

async function run(){

await consoleLine('Example : 1');

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

await consoleLine('Example : 2');

console.log("Start");
setTimeout(() => console.log("Timeout1"), 0); // 
Promise.resolve().then(() => {
  console.log("Promise1");
  setTimeout(() => console.log("Timeout2"), 0); // Phase 
});
 
Promise.resolve().then(() => console.log("Promise2"));
 
console.log("End");

}

run();

