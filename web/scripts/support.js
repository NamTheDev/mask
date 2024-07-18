(async () => {
    const supportMessageBox = document.getElementById('textarea');
    const gmailInput = document.getElementById('gmailInput');
    const submitButton = document.getElementById('submitButton');
    const contentBox = document.getElementById('contentBox');
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const alert = document.getElementById('alert');
    const icon = document.getElementById('icon');
    const alertDescription = document.getElementById('alertDescription');

    function handleScreenWidthChange(event) {
        if (event.matches) {
            // Screen width is less than 650px
            contentBox.classList.replace('mx-5', 'mx-2');
            contentBox.classList.replace('p-4', 'p-2');
            navbar.classList.replace('p-4', 'p-2');
            navbar.classList.replace('mx-5', 'mx-2');
            footer.classList.replace('mx-5', 'mx-2');
        } else {
            // Screen width is 650px or greater
            contentBox.classList.replace('mx-2', 'mx-5');
            contentBox.classList.replace('p-2', 'p-4');
            navbar.classList.replace('p-3', 'p-5');
            navbar.classList.replace('mx-2', 'mx-5');
            footer.classList.replace('mx-2', 'mx-5');
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 650px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);

    const config = await (await fetch('/config.json')).json()
    const url = window.location.href

    function sendAlert(message, type, enable) {
        const alertTypeRegex = /alert-(warning|danger|success|info)/;
        const currentAlertType = alert.className.match(alertTypeRegex);
        if (!enable) {
            submitButton.toggleAttribute('disabled');

            gmailInput.toggleAttribute('disabled');
            gmailInput.classList.add('disabled');

            supportMessageBox.toggleAttribute('disabled');
            supportMessageBox.classList.add('disabled');
        }
        if (currentAlertType) {
            alert.classList.remove(currentAlertType[0]);
        }
        icon.innerHTML = config.iconTypes[type]
        alert.classList.add(`alert-${type}`);
        alertDescription.innerHTML = message;
        alert.style.opacity = '1';
        alert.style.transform = '';
    }
    if (url.includes('?submitted')) {
        sendAlert('Your submission has been delivered! Thank you for contacting us.', 'success')

    } else if (url.includes("?cooldown")) {
        const cooldown = await (await fetch(`api/getCooldown?gmail=${localStorage.getItem('gmail')}`)).json()
        if (Number(cooldown.ms.replace('s', '').replace('m', '')) < 0) return window.location.href = '/support'
        sendAlert(`<span class="text-warning">[ON COOLDOWN]</span> - your submission has not been sent. Please wait for ${cooldown.ms}.`, 'warning')
    } else {
        sendAlert(`Write to our developer a suggestion, report or message if needed!`, 'info', true)
    }
    const { status } = await (await fetch(`/api/onCooldown?gmail=${localStorage.getItem('gmail')}`)).json()
    if (status && !window.location.href.includes('?cooldown')) return window.location.href = '?cooldown'

    function validateGmail(email) {
        // Regular expression pattern for Gmail validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        // Test the email against the regex pattern
        return gmailRegex.test(email);
    }

    const toggleValidation = async (element, option) => {
        const { classList } = element
        const oppositeOfOption = option === 'valid' ? 'invalid' : 'valid'
        classList.remove(`is-${oppositeOfOption}`)
        classList.add(`is-${option}`)
    }

    const checkIsValid = (element) => {
        const { className } = element
        return className.includes('is-valid')
    }

    submitButton.addEventListener('click', async () => {
        if (checkIsValid(gmailInput) && checkIsValid(supportMessageBox)) {
            localStorage.setItem('gmail', gmailInput.value)
            localStorage.setItem('supportMessage', supportMessageBox.value)
            return window.location.href = `/api/submitSupport?message=${encodeURI(supportMessageBox.value)}&gmail=${encodeURI(gmailInput.value)}`
        }
    })

    gmailInput.addEventListener('input', async () => {
        const validation = await validateGmail(gmailInput.value)
        if (validation)
            toggleValidation(gmailInput, 'valid');
        else toggleValidation(gmailInput, 'invalid');
    })

    supportMessageBox.addEventListener('input', () => {
        if (supportMessageBox.value.length >= config.supportMessageMaxValue)
            toggleValidation(supportMessageBox, 'valid');
        else toggleValidation(supportMessageBox, 'invalid');
    })
})()