const header = document.getElementById('header');
const contentBox = document.getElementById('contentBox');
const buttonGroup = document.getElementById('buttonGroup');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
const botAvatar = document.getElementById('botAvatar');
const footerLinks = document.getElementById('footerLinks');

// Load configuration
(async () => {
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

    header.classList.toggle('flex-column', isSmallScreen);
    header.classList.toggle('text-center', isSmallScreen);
    buttonGroup.classList.replace(isSmallScreen ? 'justify-content-start' : 'justify-content-center', isSmallScreen ? 'justify-content-center' : 'justify-content-start');

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