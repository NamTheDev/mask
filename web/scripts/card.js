const footer = document.getElementById('footer')
const title = document.getElementById('title')
const subtitle = document.getElementById('subtitle')
const nicknamesBox = document.getElementById('nicknamesBox')
const card = document.getElementById('card')

function handleScreenWidthChange(event) {
    if (event.matches) {
        // Screen width is less than 650px
        footer.classList.replace('mx-5', 'mx-2');
        nicknamesBox.classList.add('flex-column')
    } else {
        // Screen width is 650px or greater
        footer.classList.replace('mx-2', 'mx-5');
        nicknamesBox.classList.remove('flex-column')
    }
}

const mediaQuery = window.matchMedia('(max-width: 650px)');
mediaQuery.addEventListener("change", handleScreenWidthChange);

// Initial check
handleScreenWidthChange(mediaQuery);

const year = new Date().getFullYear() - 2009
subtitle.textContent = subtitle.textContent.replace('{age}', year)

const nicknames = ['Beam', 'Namir', 'Sharkboy', 'Nambuger', 'Disgusting', 'Idiot']
for (const nickame of nicknames) {
    nicknamesBox.innerHTML += `<div class='d-flex flex-wrap'><span class='bg-dark bg-opacity-50 p-2 rounded fw-semibold' style='font-size: 20px'>${nickame}</span></div>`
}