const loadText = document.querySelector('.loading-text');
const backgroundImg = document.querySelector('.bg');

let load = 0;
let unload =50;
let interval = setInterval(blurring, 30);
function blurring(){
    load++;
    unload-=0.5;
    
    if (load >99){
        clearInterval(interval);
    }
    loadText.innerText = `${load}%`;
    backgroundImg.style.filter = `blur(${unload}px)`;
    if( `${load}`==='100'){
        loadText.style.display = 'none';
    }

}