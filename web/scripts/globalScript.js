const loader = document.getElementById('loader')
let count = Number(localStorage.getItem('count'))

playPageTransition('in')

function switchPage(href) {
    playPageTransition('out')
    setTimeout(() => {
        window.location.href = href
    }, 700)
}

function playPageTransition(type) {
    switch (type) {
        case 'out':
            loader.style.transform = 'translateX(0px)'
            document.body.style.overflow = 'hidden'
            break;
        case 'in':
            setTimeout(() => {
                count += 1
                switch (count) {
                    case 1: loader.style.transform = 'translateX(2000px)'; break;
                    case 2: loader.style.transform = 'translateX(-2000px)'; count = 0; break;
                }
                localStorage.setItem('count', count)
                document.body.style.overflow = 'visible'
            }, 500)
            break;
    }
}