const header = document.getElementById('header');
const contentBox = document.getElementById('contentBox');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
const botAvatar = document.getElementById('botAvatar')

function handleScreenWidthChange(event) {
    if (event.matches) {
      // Screen width is less than 650px
      header.classList.add('flex-column', 'text-center');
      contentBox.classList.replace('mx-5', 'mx-2');
      contentBox.classList.replace('p-10', 'p-3');
      navbar.classList.replace('p-4', 'p-2');
      navbar.classList.replace('mx-5', 'mx-2');
      footer.classList.replace('mx-5', 'mx-2');
    } else {
      // Screen width is 650px or greater
      header.classList.remove('flex-column', 'text-center');
      contentBox.classList.replace('mx-2', 'mx-5');
      contentBox.classList.replace('p-3', 'p-10');
      navbar.classList.replace('p-3', 'p-5');
      navbar.classList.replace('mx-2', 'mx-5');
      footer.classList.replace('mx-2', 'mx-5');
    }
  }

  const mediaQuery = window.matchMedia('(max-width: 650px)');
  mediaQuery.addEventListener("change", handleScreenWidthChange);

  // Initial check
  handleScreenWidthChange(mediaQuery);

  async function redirect(address) {
    const {redirect} = await (await fetch('/config.json')).json()
    window.open(redirect[address])
  }