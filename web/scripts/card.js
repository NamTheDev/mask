(async () => {
    const footer = document.getElementById('footer');
    const subtitle = document.getElementById('subtitle');
    const nicknamesBox = document.getElementById('nicknamesBox');
    const profile = document.getElementById('profile');
    const additional = document.getElementById('additional');
    const header = document.getElementById('header');
    const footerLinks = document.getElementById('footerLinks');
    const videos = document.getElementById('videos');
    const { ownerNicknames, footerIcons, videoIDs } = await (await fetch('/config.json')).json();
    const markdownsBox = document.getElementById('markdownsBox');
    const MarkdownDataArray = await (await fetch('/api/markdownData?folder=card')).json();
    const card = document.getElementById('card');
    
    card.addEventListener('mouseover', () => {
        card.style.setProperty('--bs-bg-opacity', '.15');
    });
    card.addEventListener('mouseout', () => {
        card.style.setProperty('--bs-bg-opacity', '.1');
    });

    const converter = new showdown.Converter();
    for (const { name, content } of MarkdownDataArray) {
        markdownsBox.innerHTML += `<p class='text-secondary'>(${name})</p><p>${converter.makeHtml(content)}</p>`;
    }

    const defaultLinksText = [...footerLinks.getElementsByClassName('nav-item')].map(link => link.innerHTML);

    function toggleClassList(element, largeClass, smallClass, isSmallScreen) {
        element.classList.replace(isSmallScreen ? largeClass : smallClass, isSmallScreen ? smallClass : largeClass);
    }

    function handleScreenWidthChange(event) {
        const isSmallScreen = event.matches;
        toggleClassList(header, 'rounded-3', 'py-4', isSmallScreen)
        toggleClassList(footer, 'mx-5', 'mx-2', isSmallScreen);
        toggleClassList(profile, 'p-5', 'py-5', isSmallScreen);
        toggleClassList(profile, 'mx-5', 'mx-3', isSmallScreen);
        toggleClassList(additional, 'p-5', 'p-3', isSmallScreen);

        if (isSmallScreen) {
            profile.classList.add('text-center', 'flex-column');
            var index = 0;
            for (const navitem of footerLinks.getElementsByClassName('nav-item')) {
                const link = navitem.getElementsByClassName('nav-link').item(0);
                link.innerHTML = footerIcons[index];
                const icon = footerLinks.getElementsByClassName('fa-solid').item(index);
                icon.classList.add('fs-5');
                index += 1;
            }
            footerLinks.classList.add('column-gap-2', 'me-1');
        } else {
            profile.classList.remove('text-center', 'flex-column');
            var index = 0;
            for (const navitem of footerLinks.getElementsByClassName('nav-item')) {
                const link = navitem.getElementsByClassName('nav-link').item(0);
                link.innerHTML = defaultLinksText[index];
                index += 1;
            }
            footerLinks.classList.remove('column-gap-2', 'me-1');
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 800px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);

    const year = new Date().getFullYear() - 2009;
    subtitle.textContent = subtitle.textContent.replace('{age}', year);

    for (const nickname of ownerNicknames) {
        nicknamesBox.innerHTML += `<div class='d-flex flex-wrap justify-content-center'><span class='bg-black bg-opacity-50 p-2 rounded fw-semibold' style='font-size: 14px'>${nickname}</span></div>`;
    }

    const generateIframeHTML = (videoID) => {
        return `<div class="carousel-item"><iframe class='object-fit-fill' src="https://www.youtube.com/embed/${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
    };

    function insertVideos(videoIDs) {
        const videosDiv = document.getElementById('videos');
        videoIDs.forEach(videoID => {
            const iframeHTML = generateIframeHTML(videoID);
            videosDiv.innerHTML += iframeHTML;
        });
        videos.firstElementChild.classList.add('active');
        adjustIframeSizes();
    }

    function adjustIframeSizes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.style.width = window.innerWidth < 1000 ? '100%' : '1000px';
            iframe.style.height = window.innerWidth < 1000 ? `${(window.innerWidth / 1000) * 500}px` : '500px';
        });
    }

    window.addEventListener('resize', adjustIframeSizes);

    insertVideos(videoIDs);
})();
