// Load configuration
(async () => {
  const header = document.getElementById('header');
  const contentBox = document.getElementById('contentBox');
  const buttonGroup = document.getElementById('buttonGroup');
  const navbar = document.getElementById('navbar');
  const footer = document.getElementById('footer');
  const footerLinks = document.getElementById('footerLinks');
  const featureCardsBox = document.getElementById('featureCardsBox');
  const statusBoard = document.getElementById('statusBoard');
  const config = await (await fetch('/config.json')).json();
  const { serverCount, userCount, commandCount } = await (await fetch('/api/botData?requested=serverCount')).json();
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
    toggleClassList(featureCardsBox, 'flex-row', 'flex-column', isSmallScreen)
    // flex-column text-center
    statusBoard.classList.toggle('flex-column', isSmallScreen);
    statusBoard.classList.toggle('text-center', isSmallScreen)
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

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function addFeatureCard(icon, title, content) {
    featureCardsBox.innerHTML += `
      <div class="card bg-transparent text-center">
      <div class="card-body">
      <i class="${icon} m-2" style="font-size: 50px"></i>
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${content}</div></div>
  `
  }

  function initializeFeatureCards(featureCardsData) {
    for (const { icon, title, content } of featureCardsData) {
      addFeatureCard(icon, title, content)
    }
  }

  const mediaQuery = window.matchMedia('(max-width: 700px)');
  mediaQuery.addEventListener("change", handleScreenWidthChange);

  // Initial check
  handleScreenWidthChange(mediaQuery);
  initializeFeatureCards(config.features)
  animateValue(document.getElementById('serverCount'), 0, serverCount, 2000)
  animateValue(document.getElementById('userCount'), 0, userCount, 2000)
  animateValue(document.getElementById('commandCount'), 0, commandCount, 2000)
})();


async function redirect(address) {
  const { redirect } = await (await fetch('/config.json')).json();
  window.open(redirect[address]);
}