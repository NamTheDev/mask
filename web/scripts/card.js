(async () => {
    const footer = document.getElementById('footer')
    const subtitle = document.getElementById('subtitle')
    const nicknamesBox = document.getElementById('nicknamesBox')
    const profile = document.getElementById('profile')
    const additional = document.getElementById('additional')
    const { ownerNicknames } = await (await fetch('/config.json')).json()
    const markdownsBox = document.getElementById('markdownsBox')
    const MarkdownDataArray = await (await fetch('/api/markdownData?folder=card')).json()
    const card = document.getElementById('card')
    card.addEventListener('mouseover', () => {
        card.style.setProperty('--bs-bg-opacity', '.15')
    })
    card.addEventListener('mouseout', () => {
        card.style.setProperty('--bs-bg-opacity', '.1')
    })
    const converter = new showdown.Converter()
    for (const { name, content } of MarkdownDataArray) {
        markdownsBox.innerHTML += `<p class='text-secondary'>(${name})</p><p>${converter.makeHtml(content)}</p>`
    }

    function handleScreenWidthChange(event) {
        if (event.matches) {
            footer.classList.replace('mx-5', 'mx-2');
            profile.classList.add('text-center');
            profile.classList.add('flex-column');
            profile.classList.replace('p-5', 'py-5');
            profile.classList.replace('mx-5', 'mx-3');
            additional.classList.replace('p-5', 'p-3');
        } else {
            footer.classList.replace('mx-2', 'mx-5');
            profile.classList.remove('text-center');
            profile.classList.remove('flex-column');
            profile.classList.replace('py-5', 'p-5');
            profile.classList.replace('mx-3', 'mx-5');
            additional.classList.replace('p-3', 'p-5');
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 800px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);

    const year = new Date().getFullYear() - 2009
    subtitle.textContent = subtitle.textContent.replace('{age}', year)

    for (const nickame of ownerNicknames) {
        nicknamesBox.innerHTML += `<div class='d-flex flex-wrap justify-content-center'><span class='bg-black bg-opacity-50 p-2 rounded fw-semibold' style='font-size: 14px'>${nickame}</span></div>`
    }
})()