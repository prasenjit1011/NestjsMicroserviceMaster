console.clear();


for(let j = 0; j < 5; j++){
    setTimeout(() => {
        console.log(++j);
    }, j*2000);
}