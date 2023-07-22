const body = document.querySelector('body')
const localDataBase = [];
let pokemonsFetchesSoFar = 0;
let currentPage = 0;

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

async function domUpdate(callback, direction) {
    if (direction === 'next') {
        currentPage++;
    } else if (direction === 'previous' && currentPage > 1) {
        currentPage--;
    } else {
        return;
    }

    if (currentPage >= localDataBase.length) {
        await callback(3);
    }

    createMain();

    createNav();
}

function createMain() {
    const cardWrapper = document.querySelector('.cardWrapper')

    const currentArrayOfPokemons = localDataBase[currentPage - 1]
    const getPokemonImg = (indx) => currentArrayOfPokemons[indx].sprites.other.dream_world.front_default
    const getPokemonName = (indx) => currentArrayOfPokemons[indx].name.toUpperCase()
    cardWrapper.innerHTML = '';

    currentArrayOfPokemons.forEach((_, i) => {
        const cardinnerHTML = `<img src="${getPokemonImg(i)}">
        <div class="shineEffect"/></div>
        <div class="imgOverlay"/></div>
        <div class="name">${getPokemonName(i)}</div>`
        const card = createHtmlEl('div', 'card', cardinnerHTML, undefined)
        cardWrapper.appendChild(card);
    })
}

function createNav() {
    const currentPageNum = document.querySelector('.numOfActivePageInNav');
    currentPageNum.innerHTML = currentPage
    const restNavEl = createHtmlEl('div', 'restNav')

    currentPageNum.appendChild(restNavEl);
    for (let i = 0; i < localDataBase.length; i++) {
        const singeNumInsideNav = createHtmlEl('span', `num${(i+1)}`, i + 1)
        restNavEl.appendChild(singeNumInsideNav)
    }
}

async function eventListeners(){
    const next = document.querySelector('.next')
    const previous = document.querySelector('.previous')
    next.addEventListener('click', async () => {
        await domUpdate(fetchPokemons, 'next');
    });

    previous.addEventListener('click', async () => {
        await domUpdate(fetchPokemons, 'previous');
    });
    window.addEventListener('keydown', async ({key}) => {
        if (key === 'ArrowRight') {
            await domUpdate(fetchPokemons, 'next')
        } else if (key === 'ArrowLeft') {
            await domUpdate(fetchPokemons, 'previous')
        }
    })
}

function hoverEffects() {
    const pokeBall = document.querySelector('.pokeBall')
    const cardWrapper = document.querySelector('.cardWrapper')
    pokeBall.addEventListener('mouseover', () => {
        pokeBall.style.top = '0'
        pokeBall.style.opacity = '0'
        cardWrapper.style.opacity = '1';
    })
}
function createHtmlEl(type, klasa, content, source) {

    const element = document.createElement(type)
    if (klasa !== undefined) {
        element.classList.add(klasa)
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
    await domUpdate(fetchPokemons, 'next');
    hoverEffects();
    eventListeners();
})();