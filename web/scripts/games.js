// Load configuration
(async () => {
    const contentBox = document.getElementById('contentBox');
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const botAvatar = document.getElementById('botAvatar');
    const footerLinks = document.getElementById('footerLinks');
    const GTN_inputNumber = document.getElementById('GTN_inputNumber');
    const numbersDisplayBox = document.getElementById('numbersDisplayBox')

    function getRandomInt(min, max) {
        // Ensure min is less than or equal to max
        if (min > max) [min, max] = [max, min];

        // Generate random integer between min (inclusive) and max (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    GTN_inputNumber.addEventListener("keydown", function (event) {
        if (event.key === 'Enter') {
            const number = Number(GTN_inputNumber.value)
            if (isNaN(number)) {
                GTN_inputNumber.value = ''
                return alert('Invalid number.')
            }
            const randomNumbers = `${getRandomInt(100000, 999999)}`.split('')
            for (const index in randomNumbers) {
                numbersDisplayBox.children[index].style.opacity = '0'
                setTimeout(() => {
                    numbersDisplayBox.children[index].textContent = randomNumbers[index]
                    numbersDisplayBox.children[index].style.opacity = '1'
                }, 2000)
            }
        }
    });
    const config = await (await fetch('/config.json')).json();
    const defaultLinksText = [...footerLinks.getElementsByClassName('nav-item')].map(link => link.innerHTML);

    function toggleClassList(element, largeClass, smallClass, isSmallScreen) {
        element.classList.replace(isSmallScreen ? largeClass : smallClass, isSmallScreen ? smallClass : largeClass);
    }

    function handleScreenWidthChange(event) {
        const isSmallScreen = event.matches;
        toggleClassList(contentBox, 'mx-5', 'mx-2', isSmallScreen);
        toggleClassList(contentBox, 'p-10', 'p-3', isSmallScreen);
        toggleClassList(navbar, 'p-4', 'p-2', isSmallScreen);
        toggleClassList(navbar, 'mx-5', 'mx-2', isSmallScreen);
        toggleClassList(footer, 'mx-5', 'mx-2', isSmallScreen);

        [...footerLinks.getElementsByClassName('nav-item')].forEach((navitem, index) => {
            const link = navitem.getElementsByClassName('nav-link')[0];
            link.innerHTML = isSmallScreen ? config.footerIcons[index] : defaultLinksText[index];
            if (isSmallScreen) {
                footerLinks.getElementsByClassName('fa-solid')[index].classList.add('fs-5');
            }
        });

        footerLinks.classList.toggle('column-gap-2', isSmallScreen);
        footerLinks.classList.toggle('me-1', isSmallScreen);
    }

    const mediaQuery = window.matchMedia('(max-width: 700px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);
})();

async function redirect(address) {
    const { redirect } = await (await fetch('/config.json')).json();
    window.open(redirect[address]);
}