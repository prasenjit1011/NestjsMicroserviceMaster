
// Normal function
function add(a, b) {
return a + b;
}

// Curried version
function curriedAdd(a) {
    console.log('A : ',a);
    return function(b) {
        console.log('B : ',b);
        return 8;
        // return function(c) {
        //     console.log('C : ',c);
        //     return a + b + c;
        // };
    };
}


console.log(curriedAdd(2)(3)(4)); // 9