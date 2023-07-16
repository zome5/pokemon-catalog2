const API = 'https://pokeapi.co/api/v2/pokemon/'
const wrapper = document.querySelector('wrapper')
const main = document.querySelector('main')
const pokemonOne = document.querySelector('.pokemonOne')
const backCards = Array.from(document.querySelectorAll('.backCard'))
const next = document.querySelector('.next')
const previous = document.querySelector('.previous')
const page = document.querySelector('.currentPage');
let localDataBase = ['empty'];
let pokemonsFetchesSoFar = 0;
let currentPage = 0;
let c = pokemonsFetchesSoFar; // counter
let allPages = [];

async function fetchPokemons() {
    let pokemonsFetched = [];

    for (let i = 0; i < 3; i++) {
        c++
        pokemonsFetched.push(await (await fetch(API + c)).json());
    }
    localDataBase.push(pokemonsFetched);
    return pokemonsFetched
}

async function domUpdate(fn, direction) {

    if (direction === 'next') {
        currentPage++;
    } else if (direction === 'previous' && currentPage > 1) {
        currentPage--;
    } else {
        return;
    }

    if (currentPage >= localDataBase.length) {
        await fn();
    }

    pokemonOne.innerHTML = ` <img src="${localDataBase[currentPage][1].sprites.other.dream_world.front_default}"
    alt="${localDataBase[currentPage][1].name}">
    <div class="imgOverlay"></div>
    <div class="shineEffect"></div>
    <div class="name">${localDataBase[currentPage][1].name.toUpperCase()}</div>
    <div class="info">${localDataBase[currentPage][1].name.toUpperCase()}</div>`;
    backCards[0].innerHTML = `<img src="${localDataBase[currentPage][0].sprites.other.dream_world.front_default}"><div class="shineEffect"></div><div class="imgOverlay"></div><div class="name">${localDataBase[currentPage][0].name.toUpperCase()}</div>`;
    backCards[1].innerHTML = `<img src="${localDataBase[currentPage][2].sprites.other.dream_world.front_default}"><div class="shineEffect"></div><div class="imgOverlay"></div><div class="name">${localDataBase[currentPage][2].name.toUpperCase()}</div>`;

    nav = () => {
        const pagesHTML = localDataBase.toSpliced(0, 1).map((_, i) => `<span class="num${(i+1)}">${i + 1}</span>`)
        page.innerHTML = `<p>${currentPage}</p><div class='restNav'><p>${pagesHTML}</p></div`;
        allPages = document.querySelectorAll('p span')
        allPages.forEach((p, i) => {
            p.addEventListener('click', () => {
                console.log(i);
            })
        })
    }
    nav();
}

async function eventListeners() {
    next.addEventListener('click', async () => {
        await domUpdate(fetchPokemons, 'next');
    });

    previous.addEventListener('click', async () => {
        await domUpdate(fetchPokemons, 'previous');
    });
    window.addEventListener('keydown', async (e) => {
        if (e.key === 'ArrowRight') await domUpdate(fetchPokemons, 'next');
        else if (e.key === 'ArrowLeft') await domUpdate(fetchPokemons, 'previous');
    })
}
//visual functions: 
function hoverEffects() {
    const restNav = document.querySelector('.restNav')
    const emptyBox = document.querySelector('.box-needed-for-event-mouseleave-in-eventlistener')
    main.addEventListener('mouseenter', () => {

        backCards[0].classList.add('activeBackCard1');
        backCards[1].classList.add('activeBackCard2');
        emptyBox.addEventListener('mouseleave', () => {
            backCards[0].classList.remove('activeBackCard1');
            backCards[1].classList.remove('activeBackCard2');
        })
    })


}
//execution: 
domUpdate(fetchPokemons, 'next');
hoverEffects();
eventListeners();