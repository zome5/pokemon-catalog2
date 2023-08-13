'use strict'
const body = document.querySelector('body')
const localDataBase = [];
let pokemonsFetchesSoFar = 0;
let currentPage = 0;
const cardWrapper = document.querySelector('.cardWrapper')
const POKEMONS_TO_GET =1;
const restNavEl = createHtmlEl('div', 'restNav')
let navIndex = 0;


async function fetchPokemons(numOfFetches) {
    const API = 'https://pokeapi.co/api/v2/pokemon/'
    let pokemonsFetched = [];
    try {
        for (let i = 0; i < numOfFetches; i++) {
            pokemonsFetchesSoFar++
            const response = await fetch(API + pokemonsFetchesSoFar);
            if (!response.ok) {
                throw new Error ('Response error, recieved data is not correct.');
            }
            const result = await response.json();
            pokemonsFetched.push(result);
        }
        localDataBase.push(pokemonsFetched);
    } catch (error) {
        handleConnectionError(error); 
    }
}

async function domUpdate(direction) {


    if (direction === 'next') {
        currentPage++;
    } 
    else if (typeof direction === 'number'){
currentPage = direction;
    }
    else if (direction === 'previous' && currentPage > 1) {
        currentPage--;   
    } 

    if (currentPage<localDataBase.length) {
        imgsUpdate();
        createNav();
        return}
     
    else {
        const loadingContent = '<div class="loadingArm"><div class="loadingLine"></div></div>'
        const loading = createHtmlEl('div', 'loading', loadingContent, undefined)
        cardWrapper.innerHTML ='';
        cardWrapper.appendChild(loading);
       
        
        await fetchPokemons(POKEMONS_TO_GET);
    }
 
 

  

    imgsUpdate();
   createNav();

}

function imgsUpdate() {
    const currentArrayOfPokemons = localDataBase[currentPage - 1]

    const getPokemonImg = (idx) => currentArrayOfPokemons[idx].sprites.other.dream_world.front_default
    const getPokemonName = (idx) => currentArrayOfPokemons[idx].name.toUpperCase()
    cardWrapper.innerHTML = '';

    currentArrayOfPokemons.forEach((_, idx) => {
        const cardinnerHTML = `<img src="${getPokemonImg(idx)}" alt="${getPokemonName(idx)}">
        <div class="shineEffect"></div>
        <div class="imgOverlay"></div>
        <div class="name">${getPokemonName(idx)}</div>`
        const card = createHtmlEl('div', 'card', cardinnerHTML, undefined)
        cardWrapper.appendChild(card);
    })
}


 function createNav() {
    const displayedPage = document.querySelector('.numOfActivePageInNav');
    displayedPage.innerHTML = currentPage
    displayedPage.appendChild(restNavEl);
    if (navIndex <= currentPage) {
    navIndex++;
    const singeNumInsideNav = createHtmlEl('span', undefined, navIndex)
    singeNumInsideNav.addEventListener('click', () => domUpdate((Number(singeNumInsideNav.innerHTML))))
    restNavEl.appendChild(singeNumInsideNav)}
}

async function eventListeners(){
    const next = document.querySelector('.next')
    const previous = document.querySelector('.previous')
  
    next.addEventListener('click',  () => {
         domUpdate('next');
    });

    previous.addEventListener('click',  () => {
         domUpdate('previous');
    });
    window.addEventListener('keydown',  ({key}) => {
        if (key === 'ArrowRight') {
             domUpdate('next')
        } else if (key === 'ArrowLeft') {
             domUpdate('previous')
        }
    })
    }
function handleConnectionError(error){
    const wrapper = document.querySelector('.wrapper')
    wrapper.style.display = 'none'
        const woodenDoorImg = createHtmlEl('img', undefined, undefined, 'closeddoor.png')
        body.appendChild(woodenDoorImg)
        body.classList.add('catch')
        body.innerHTML += '<p>Request error. Check your internet connection or contact our support<p>'
        console.log('ERROR: ', error);
}

function hoverEffect() {
    const pokeBall = document.querySelector('.pokeBall')
    const cardWrapper = document.querySelector('.cardWrapper')
    pokeBall.addEventListener('mouseover', () => {
        pokeBall.style.top = '0'
        pokeBall.style.opacity = '0'
        cardWrapper.style.opacity = '1';
    })
}
function createHtmlEl(type, className, content, source) {

    const element = document.createElement(type)
    if (className !== undefined) {
        element.classList.add(className)
    }

    if (content !== undefined) {
        element.innerHTML = content
    }
    if (type === 'img') {
        if (typeof source === 'function') {
            element.src = "";
            element.src = source()
        } else {
            element.src = source
        }
    }
    return element
}

(async () => {
    await domUpdate('next');
    hoverEffect();
    eventListeners();

})();