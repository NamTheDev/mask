(async () => {
    // Element selectors
    const supportMessageBox = document.getElementById('textarea');
    const gmailInput = document.getElementById('gmailInput');
    const submitButton = document.getElementById('submitButton');
    const contentBox = document.getElementById('contentBox');
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const alert = document.getElementById('alert');
    const icon = document.getElementById('icon');
    const alertDescription = document.getElementById('alertDescription');
    const footerLinks = document.getElementById('footerLinks')

    let isFormChanged = false;
    const mediaQuery = window.matchMedia('(max-width: 650px)');

    // Load configuration
    const config = await (await fetch('/config.json')).json();

    // Media query handler
    const defaultLinksText = [...footerLinks.getElementsByClassName('nav-item')].map(link => link.innerHTML)
    function handleScreenWidthChange(event) {
        const isSmallScreen = event.matches;
        toggleClassList(contentBox, 'mx-5', 'mx-2', isSmallScreen);
        toggleClassList(contentBox, 'p-4', 'p-2', isSmallScreen);
        toggleClassList(navbar, 'p-5', 'p-2', isSmallScreen);
        toggleClassList(navbar, 'mx-5', 'mx-2', isSmallScreen);
        toggleClassList(footer, 'mx-5', 'mx-2', isSmallScreen);

        if (isSmallScreen) {
            var index = 0
            for (const navitem of footerLinks.getElementsByClassName('nav-item')) {
                const link = navitem.getElementsByClassName('nav-link').item(0)
                link.innerHTML = config.footerIcons[index]
                const icon = footerLinks.getElementsByClassName('fa-solid').item(index)
                icon.classList.add('fs-5')
                index += 1
            }
            footerLinks.classList.add('column-gap-2')
            footerLinks.classList.add('me-1')
        } else {
            var index = 0
            for (const navitem of footerLinks.getElementsByClassName('nav-item')) {
                const link = navitem.getElementsByClassName('nav-link').item(0)
                link.innerHTML = defaultLinksText[index]
                index += 1
            }
            footerLinks.classList.remove('column-gap-2')
            footerLinks.classList.remove('me-1')
        }
    }

    function toggleClassList(element, largeClass, smallClass, isSmallScreen) {
        element.classList.replace(isSmallScreen ? largeClass : smallClass, isSmallScreen ? smallClass : largeClass);
    }

    // Initial check
    handleScreenWidthChange(mediaQuery);
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Alert handler
    function sendAlert(message, type, enableForm) {
        toggleForm(enableForm);

        const alertTypeRegex = /alert-(warning|danger|success|info)/;
        const currentAlertType = alert.className.match(alertTypeRegex);
        if (currentAlertType) alert.classList.remove(currentAlertType[0]);

        icon.innerHTML = config.iconTypes[type];
        alert.classList.add(`alert-${type}`);
        alertDescription.innerHTML = message;
        alert.style.opacity = '1';
        alert.style.transform = '';
    }

    function toggleForm(enable) {
        [submitButton, gmailInput, supportMessageBox].forEach(element => {
            element.toggleAttribute('disabled', !enable);
            element.classList.toggle('disabled', !enable);
        });
    }

    // URL handling
    if (window.location.href.includes('?submitted')) {
        sendAlert('Your submission has been delivered! Thank you for contacting us.', 'success');
    } else if (window.location.href.includes("?cooldown")) {
        const cooldown = await (await fetch(`api/getCooldown?gmail=${localStorage.getItem('gmail')}`)).json();
        if (Number(cooldown.ms.replace('s', '').replace('m', '')) < 0) {
            window.location.href = '/support';
        } else {
            sendAlert(`You can submit another submission after ${cooldown.ms}.`, 'warning');
        }
    } else {
        sendAlert('Write to our developer a suggestion, report, or message if needed!', 'info', true);
    }

    // Email validation
    function validateGmail(email) {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    }

    async function toggleValidation(element, isValid) {
        const oppositeClass = isValid ? 'is-invalid' : 'is-valid';
        const currentClass = isValid ? 'is-valid' : 'is-invalid';
        element.classList.remove(oppositeClass);
        element.classList.add(currentClass);
    }

    function checkIsValid(element) {
        return element.className.includes('is-valid');
    }

    // Form submission handler
    submitButton.addEventListener('click', () => {
        if (checkIsValid(gmailInput) && checkIsValid(supportMessageBox)) {
            localStorage.setItem('gmail', gmailInput.value);
            localStorage.setItem('supportMessage', supportMessageBox.value);
            isFormChanged = false;
            window.location.href = `/api/submitSupport?message=${encodeURI(supportMessageBox.value)}&gmail=${encodeURI(gmailInput.value)}`;
        }
    });

    // Input event listeners
    gmailInput.addEventListener('input', async () => {
        isFormChanged = true;
        const isValid = validateGmail(gmailInput.value);
        await toggleValidation(gmailInput, isValid);
    });

    supportMessageBox.addEventListener('input', () => {
        isFormChanged = true;
        const isValid = supportMessageBox.value.length >= config.supportMessageMaxValue;
        toggleValidation(supportMessageBox, isValid);
    });

    // Prompt unsaved changes
    window.addEventListener('beforeunload', (event) => {
        if (isFormChanged) {
            event.preventDefault();
        }
    });
})();
