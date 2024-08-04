const loader = document.getElementById('loader');
let count = Number(localStorage.getItem('count')) || 0;

function switchPage(href) {
    playPageTransition('out');
    setTimeout(() => {
        window.location.href = href;
    }, 700);
}

function playPageTransition(type) {
    if (type === 'out') {
        loader.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
    } else if (type === 'in') {
        setTimeout(() => {
            count = (count + 1) % 2; // Simplified count handling
            loader.style.transform = count === 1 ? 'translateX(2000px)' : 'translateX(-2000px)';
            localStorage.setItem('count', count);
            document.body.style.overflow = 'visible';
        }, 500);
    }
}