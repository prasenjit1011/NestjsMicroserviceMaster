
console.clear();
let lineNum = 0;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function consoleLine(str = 'DSA'){
  lineNum++;
  // await delay(1000);
  await console.log('\n====================== '+lineNum+' '+(new Date().toString())+' '+str+' =======================================================\n');
}

consoleLine(' -: App Started :- '+ (new Date).toLocaleTimeString());




consoleLine();

let arr = [1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,3,4,5,5,5,5,5,5,6,6,6,6,6,6,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]
let k, arr1, arr2, sum, sum1, str, str1, obj, obj1, obj2, newobj,  result, result1, result2, data;
let j, x, y, z,  vowels, vCount, cCount, maxElement, ans, curLength;
let x1  = {};


consoleLine();
arr2 = [1, 2, 3];
data = arr2.map((num) => {
  if (num > 1) return;
  return num * 2;
});

console.log(data)
// [ 2, undefined, undefined ]

consoleLine();


obj = {};
str = '';
k   = 3;

for(let i=0; i<arr.length; i++){
  if(!obj[arr[i]]){
    obj[arr[i]] = 0;
  }
  obj[arr[i]]++;
}

Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,k).map((val)=>{str += val[0]});
console.log('\n Array : ',arr);
console.log('\n Object : ',obj);
console.log('\n String ',str);

consoleLine('Promise all, race, allSettled')
let i = 5;
const p1 = new Promise((resolve, reject)=>{
  return resolve('One')
});
const p2 = Promise.resolve('Two');
const p3 = Promise.resolve('Three');
const p4 = Promise.resolve('Four');
const p5 = Promise.reject('Six')

Promise.all([p1, p2, p5])
  .then((val) => { i++;console.log('Promise all Success ',val); })
  .catch((err) => { i++;console.log('Promise all Error : ',err); });
  
Promise.all([p1, p2])
  .then((val) => { i++;console.log('Promise all Success : ',val); })
  .catch((err) => { i++;console.log('Promise all Error : ',err); });

Promise.allSettled([p1, p2, p5])
  .then((val) => { i++;console.log('Promise allSettled Success : ',val); })
  .catch((err) => { i++;console.log(err); });


console.log(' i = ',i)
Promise.race([p1, p2, p5])
  .then((val) => { i++;console.log('Promise Race Success : ',val); })
  .catch((err) => { i++;console.log('Promise Race Error : ',err); });


console.log(' i = ',i)

consoleLine();



consoleLine('Element delete from array and object, Merge two array ****');
arr = [];
arr.push(123);
arr.push(456);
arr.push(789);
arr.push(111,222);

console.log('Orginal Array :',arr);
x = arr.shift();
console.log('Delete Element from array .shift():',x);
console.log('After Delete :',arr);

arr1 = ['aaaa','bbbb','cccc']
result = [...arr, ...arr1]
console.log('Array merge [...arr, ...arr1] :',result,'\n\n')


obj = {'a':1,'b':3,c:5};
obj[1] = [145];
obj[1].push(123)
console.log('Object element push and delete : ',obj);

delete obj['b']; //* Most Important */
console.log("delete obj['b']")
console.log('After delete b eleemet : ', obj)


consoleLine('Move Zero to Last');

arr = [0,1,0,5, 7, 3,12,11];
result1 = arr.filter(val=>val?true:false);
result2 = arr.filter(val=>val?false:true);
data = [...result1, ...result2]

console.log(arr);

console.log(data);

consoleLine('Sliding Window : Non Repeate String');
let myfn = (str) => {
  let obj = [];
  let length = 0;

  for (let i = 0; i < str.length; i++) {

    // 🔁 Instead of reset → remove until duplicate gone
    while (obj.includes(str[i])) {
      obj.shift(); // remove from left
    }

    obj.push(str[i]);

    if (length < obj.length) {
      length = obj.length;
    }
  }

  console.log(str, ' : ', length);
}

myfn("abcddefgh")
myfn("abcbdeaf")
myfn("aabcbcdbca")
myfn("bbbbb")
myfn("pwwkew")
myfn("abcdef")
myfn("abcabcbb")


consoleLine()

obj   = { a: 5, b: { c: 6, d: { e: 2, f:5 } }, c:99 }
newobj  = {};

const fn = (str, obj) => {
  Object.entries(obj).map((val)=>{
    if(typeof(val[1]) == 'object'){
      fn(str+val[0],val[1])
    }
    else{
      newobj[str+val[0]] = val[1];
    }
  });
}

fn('',obj);

console.log(obj);
console.log(newobj);

consoleLine('Largest Number with key');

obj = { a: 1, b: 4, c: 8, d: 2, f: 3 };
maxElement = Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,2)
console.log(obj);
console.log('Largest Number with key : ',maxElement);

consoleLine('DSA');

str   = 'aaaabbccccddccffaaccbbf';
str1  = '';
obj   = {};

for(let i in str){
  obj[str[i]] = !obj[str[i]]? 1 : ++obj[str[i]];
}

Object.entries(obj).map((val)=>{
  str1 += val[0]+val[1];
})


console.log('String : ',str);
console.log('Object : ',obj);
console.log('String : ',str1)


consoleLine()

// "I Love Riyan" => "I evoL nayiR"
str = "I Love Riyan";
str1 = '';
str.split(' ').map((val)=>{
  str1 += val.split('').reverse().join('')+' ';
});

console.log(str);
console.log(str1);

consoleLine('Vowels Count')

// developer => Output: Vowels: 4, Consonants: 5
str = 'developer';
vowels = 'aeiou';
vCount = 0;
cCount = 0;
for(let i in str){
  if(vowels.includes(str[i])){
    vCount++;
  }
  else{
    cCount++;
  }
}

console.log(str);
console.log('Vowels: '+vCount+', Consonants: '+cCount);


consoleLine('Longest words')

// Longest words : I am learning JavaScript
str = 'I am learning JavaScript';
obj = {};
let longestWords = '';
k = 0;
arr = str.split(' ').map((val)=>{
  if(val.length > longestWords.length){
    longestWords = val;
  }
});

console.log('String : ',str);
console.log('Longest Words : ', longestWords);


consoleLine('Closure')

function closureFn(){
  let x = 0;
  return function fn1(){
    let c = 20;
    x = x + c;
    return x++;
  }
}

const hello = closureFn();
console.log(hello()) //20
console.log(hello()) //41
console.log(hello()) //62

consoleLine('Closure and Debounce Function')

consoleLine("Starting debounce test at", new Date().toLocaleTimeString(), ' :-');

const callApi = (param) => {
  console.log('\n\n -: Closure and Debounce Function :',new Date().toLocaleTimeString(),' : ', param, ' \n\n\n');
};

const debounce = (delay) => {
  let timer;
  const fn =  (str) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callApi(str);
    }, delay);
  };
  return fn;
}

const debouncedPrint = debounce(100);
debouncedPrint(`Call 1`);
debouncedPrint(`Call 2`);
debouncedPrint(`Call 3`);
debouncedPrint(`Call 4`);


consoleLine('Call Bind** ')  
const person = {
      firstName: "Alice",
      lastName: "Johnson",
      greet: function() {
        return `Hello, ${this.firstName}!`;
      }
    };

const unboundGreet = person.greet.bind(person);
console.log('11111',person.greet())
console.log('22222',person.greet.bind(person)());




consoleLine('Find the length of longest consecutive elements')
arr = [100,4,101,102,103,200,1,104,105,3,2];
data = arr.sort((a,b)=>a-b)
ans = 0;
curLength = 1;
for(let i=0; i<data.length; i++){
  
  if(data[i]+1 == data[i+1]){
    curLength++;
  }
  else{
    curLength = 1;
  }
  
  if(ans<curLength){
    ans = curLength;
  }
}


console.log('Answer : ',ans);
console.log(arr)


consoleLine('Find Duplicate')
arr   = [1,3,4,2,2,4,4,4,4,4,4,3,3];
data  = {};

for(let i=0; i<arr.length; i++){
  data[arr[i]] = !data[arr[i]] ? 1 : data[arr[i]] +1 ;
}

result = Object.entries(data).filter((val)=>val[1]>1?true:false).sort((a,b)=>b[1]-a[1])

console.log(arr);
console.log(data);
console.log(result)

consoleLine('Find first dublicate')
arr   = [2,1,3,5,6,4,2,3,2,9,9]
obj = [];
result = '';
for(let i=0; i<arr.length; i++){
  if(!obj.includes(arr[i])){
    obj.push(arr[i])
  }
  else{
    result = arr[i];
    break;
  }
}

console.log(arr)
console.log('First dublicate : ',result)


consoleLine('Group Anagrams')

arr = ["eat","tea","tan","ate","nat","bat"]
// Output: [["eat","tea","ate"],["tan","nat"],["bat"]]
obj = {}
str;
for(let i=0; i<arr.length; i++){
  str = arr[i].split('').sort().join('')
  if(!obj[str]){
    obj[str] = [] 
  }
  obj[str].push(arr[i]);
}


console.log(arr);
console.log(Object.values(obj))


consoleLine('Find max sub array');

arr = [2, 1, 5, 1, 3, 2]
arr1 = arr2 = [];
k = 3
sum = 0;

for(let i = 0; i<arr.length;i++){
  arr1 = [];
  sum1 = 0;
  j = i;
  while(arr1.length<k){   
    sum1 += arr[j];
    arr1.push(arr[j]);
    j++;
  }
  if(sum < sum1){
    arr2 = arr1;
    sum = sum1;
  }
}

console.log('Orginal Array : ',arr);
console.log('Sub-Array of length '+k+' with max: ',arr2, sum)
console.log('Sub-Array : ',arr2)
console.log('Max-Sum : ', sum)


consoleLine();


consoleLine(99)

var keys  = {}
keys['hello'] = 5;
keys['hii']   = 3;

Object.keys(keys).forEach((val, k)=>{
  console.log('--->',val,'||', k)
})

for(let index in keys){
  console.log(keys[index], index)
}
console.log(keys);

Array.prototype.double = function () {
  return this.map(x => x * 2);
};

const a = [1, 2, 3];
console.log(a.double()); // [2, 4, 6]
      
consoleLine();
/*


      ---------- Example 02 ----------

      function fn(a: string, b: string = 'World'): string {
        return a + b;
      }
      var str = fn('hello')
      console.log(str)

*/
/*


      ---------- Example 02888 ----------*/

obj1 = { a: 5, b: { c: 6, d: { e: 2 } } };
x = Object.keys(obj1);
y = Object.values(obj1);
z = Object.entries(obj1);

x1 = { a: 1, b: 4, c: 8, d: 2, f: 3 };
const v1 = Math.max(...Object.values(x1));
const v2 = Math.max(...[[1,2],3,4].flat());
const v3 = Math.max(1,2,3,4);

console.log(x1);
console.log(v1, v2, v3);
consoleLine();


setImmediate(()=>{console.log('01 setImmediate')});
setTimeout(()=>{console.log('02 setTimeout')},0)
process.nextTick(()=>{console.log('03 nextTick');});
console.log('04 consoleLog')

console.log(x,y,z);

consoleLine();
/*


      ---------- Example 02 ----------*/

      arr1 = [1,2,3,4,5,9]
      const length = arr1.length;
      const target = 6;
      result = [];
      
      for(let i = 0; i< length; i++){
        for(let j=i+1; j< length; j++){
          if(arr1[i]+arr1[j] == target){
            result.push([arr1[i],arr1[j]]);
          }
        }
      }
      
      console.log('\n Result : ',result)
      
      
      
/*


      ---------- Example 03 ----------

      var obj = { a: 5, b: { c: 6, d: { e: 2 } } };
      var keys = [];
      
      getKeys(obj)
      
      function getKeys(obj){
        for(let val in obj){
          keys.push(val)
          if(typeof obj[val] === 'object'){
            getKeys(obj[val]);
          }
        }
      }
      
      console.log(keys);
      [ 'a', 'b', 'c', 'd', 'e' ]
      


      ------------------------------------------------------*/

      obj2 = { a: 5, b: { c: 6, d: { e: 2 } } };
      result2 = [];

      getKeys(obj2);
      
      function getKeys(obj){
        Object.entries(obj).map((value, key)=>{
          result.push(value[0]);
          if(typeof value[1] == 'object'){
            getKeys(value[1]);
          }
        })
      }
      
      console.log('Result2 : ',result2);





async function foo() {
  console.log("A2");
  await bar();
  console.log("B5");
}
async function bar() {
  console.log("C3");
}

console.log("D1");
foo();
Promise.resolve().then(() => console.log("E6"));
console.log("F4");

// D1 A2 C3 F4 B5 E6

consoleLine();

console.log("Start");
setTimeout(() => console.log("Timeout1"), 0); // 
Promise.resolve().then(() => {
  console.log("Promise1");
  setTimeout(() => console.log("Timeout2"), 0); // Phase 
});
 
Promise.resolve().then(() => console.log("Promise2"));
 
console.log("End");


consoleLine('Call, Bind');



obj = {
  name: "JS",
  getName: function () {
    return this.name;    
  },
};

const getName = obj.getName;
console.log(obj.getName());

console.log([] == ![], 1 == !1, 3>2>1, [] + {})
console.log([] == ![]) // 
console.log(3 > 2 > 1) //false
console.log([] + {}) //[object object]

consoleLine();



let num = 98456;
let arr5 = [];
for(let i = 10; 0<num; i = i*1 ){
  arr5.push(num%i);
  num = parseInt(num/i);
}

console.log(arr5.join(''));

/*



 


const arr4 = [2, 7, 8, 11, 1, 15, 9];
const target = 9;
// Output: [0,1]
let res = {};
let k4 = 0;

for(let i=0; i< arr4.length; i++){
  if(arr4[i] == target){
    res[k4++] = [i];
  }
  else{
    for(let j=i+1; j<arr.length; j++){
      if(arr4[i]+arr4[j] == target){
        res[k4++] = [i,j];
      }
    }  
  }
  
}

console.log(Object.values(res));


// async function fetchData() {
//   const res  = fetch("https://api.com/data");
//   const data = res.json();
//   return data;
// }

// console.log(fetchData())



const arr3 = ["eat", "tea", "tan", "ate", "nat", "bat"];
let res3 = {};
let str3;
for(let i = 0; i<arr3.length; i++){
  str3 = arr3[i].split('').sort().join('');
  if(!res3[str3]){
    res3[str3] = [];
  }
  res3[str3].push(arr3[i]);
}

console.log(Object.values(res3));

/* */

