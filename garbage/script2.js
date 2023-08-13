'use strict'
const body = document.querySelector('body')
const localDataBase = [];
let pokemonsFetchesSoFar = 0;
let currentPage = 0;
const cardWrapper = document.querySelector('.cardWrapper')
const POKEMONS_TO_GET = 3

async function fetchPokemons(numOfFetches) {
    const wrapper = document.querySelector('.wrapper')
    const API = 'https://pokeapi.co/api/v2/pokemon/'
    let pokemonsFetched = [];
    try {
        for (let i = 0; i < numOfFetches; i++) {
            pokemonsFetchesSoFar++
            const request = await fetch(API + pokemonsFetchesSoFar);
            const result = await request.json();
            pokemonsFetched.push(result);
        }
        localDataBase.push(pokemonsFetched);
        return pokemonsFetched
    } catch (error) {
        wrapper.style.display = 'none'
        const woodenDoorImg = createHtmlEl('img', undefined, undefined, 'closeddoor.png')
        body.appendChild(woodenDoorImg)
        body.classList.add('catch')
        body.innerHTML += '<p>Request error. Check your internet connection or contact our support<p>'
        console.log('ERROR: ', error);
    }
}

const AvailableActions = {
    PREVIOUS: 'previous',
    NEXT: 'next'
}

async function domUpdate(direction) {
    if (direction === AvailableActions.NEXT) {
        currentPage++;
    }
    else if (typeof direction === 'number'){
        currentPage = direction;
    }
    else if (direction === AvailableActions.PREVIOUS && currentPage > 1) {
        currentPage--;
    } else {
        return;
    }
    if (currentPage >= localDataBase.length) {
        const loadingKontent = '<div class="loadingArm"><div class="loadingLine"></div></div>'
        const loading = createHtmlEl('div', 'loading', loadingKontent, undefined)
        cardWrapper.innerHTML ='';
        cardWrapper.appendChild(loading);       
        
        await fetchPokemons(POKEMONS_TO_GET);
    }
    imgsUpdate();
    createNav();
}

function imgsUpdate() {
    const currentArrayOfPokemons = localDataBase[currentPage - 1]
    
    const getPokemonImg = (indx) => currentArrayOfPokemons[indx].sprites.other.dream_world.front_default
    const getPokemonName = (indx) => currentArrayOfPokemons[indx].name.toUpperCase()
    cardWrapper.innerHTML = '';

 
    currentArrayOfPokemons.forEach((_, i) => {
        const cardinnerHTML = `<img src="${getPokemonImg(i)}" alt="${getPokemonName(i)}">
        <div class="shineEffect"/></div>
        <div class="imgOverlay"/></div>
        <div class="name">${getPokemonName(i)}</div>`
        const card = createHtmlEl('div', 'card', cardinnerHTML, undefined)
        cardWrapper.appendChild(card);
    })
}

async function createNav() {
    const displayedPage = document.querySelector('.numOfActivePageInNav');
    displayedPage.innerHTML = currentPage
    const restNavEl = createHtmlEl('div', 'restNav')

    displayedPage.appendChild(restNavEl);
    for (let i = 0; i < localDataBase.length; i++) {
        const singeNumInsideNav = createHtmlEl('span', `num${(i+1)}`, i + 1)
        restNavEl.appendChild(singeNumInsideNav)
        const navNumbers = Array.from(document.querySelectorAll('.restNav span'))

    navNumbers.forEach(number => {
        number.addEventListener('click', async () => domUpdate((Number(number.innerHTML))))
    })
    }
}

function eventListeners() {
    const next = document.querySelector('.next')
    const previous = document.querySelector('.previous')
  
    next.addEventListener('click', () => {
     domUpdate(AvailableActions.NEXT);
    });

    previous.addEventListener('click',  () => {
         domUpdate(AvailableActions.PREVIOUS);
    });

    window.addEventListener('keydown',  ({key}) => {
        if (key === 'ArrowRight') {
             domUpdate(AvailableActions.NEXT)
        } else if (key === 'ArrowLeft') {
             domUpdate(AvailableActions.PREVIOUS)
        }
    })
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
    await domUpdate(AvailableActions.NEXT);
    hoverEffect();
    eventListeners();
})();
