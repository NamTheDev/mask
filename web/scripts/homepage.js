const header = document.getElementById('header');
const contentBox = document.getElementById('contentBox');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');

function handleScreenWidthChange(event) {
    if (event.matches) {
      // Screen width is less than 650px
      header.classList.add('flex-column', 'text-center');
      contentBox.classList.replace('mx-5', 'mx-3');
      navbar.classList.replace('mx-5', 'mx-3');
      footer.classList.replace('mx-5', 'mx-3');
    } else {
      // Screen width is 650px or greater
      header.classList.remove('flex-column', 'text-center');
      contentBox.classList.replace('mx-3', 'mx-5');
      navbar.classList.replace('mx-3', 'mx-5');
      footer.classList.replace('mx-3', 'mx-5');
    }
  }

  const mediaQuery = window.matchMedia('(max-width: 650px)');
  mediaQuery.addEventListener("change", handleScreenWidthChange);

  // Initial check
  handleScreenWidthChange(mediaQuery);