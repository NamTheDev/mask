(async () => {
    const supportMessageBox = document.getElementById('textarea')
    const gmailInput = document.getElementById('gmailInput')
    const gmailInputBox = document.getElementById('gmailInputBox')
    const submitButton = document.getElementById('submitButton')
    const editButton = document.getElementById('editButton')
    const returnButton = document.getElementById('returnButton')
    const config = await (await fetch('/config.json')).json()
    const url = window.location.href
    const description = document.getElementById('description')
    if (url.includes('?submitted')) {
        submitButton.style.display = 'none';
        supportMessageBox.style.display = 'none';
        gmailInputBox.style.display = 'none';
        returnButton.style.display = '';
        description.textContent = 'Your submission has been delivered! Thank you for contacting us.'

    } else if (url.includes('?failed')) {
        submitButton.style.display = 'none';
        supportMessageBox.style.display = 'none';
        gmailInputBox.style.display = 'none';
        editButton.style.display = '';
        description.innerHTML = '<span class="text-danger">[INVALID gmail]</span> - your submission has not been sent.<br>Please check your gmail address carefully before submitting.'
        editButton.addEventListener('click', () => {
            window.location.href = '/support?edit'
        })
    } else if (url.includes('?edit')) {
        gmailInput.value = localStorage.getItem('gmail')
        supportMessageBox.value = localStorage.getItem('supportMessage')
        gmailInput.classList.add('is-invalid')

    } else if (url.includes("?cooldown")) {
        description.innerHTML = ''
        submitButton.style.display = 'none';
        supportMessageBox.style.display = 'none';
        gmailInputBox.style.display = 'none';
        async function updateDescription() {
            const cooldown = await (await fetch(`api/getCooldown?gmail=${localStorage.getItem('gmail')}`)).json()
            if (Number(cooldown.ms.replace('s', '').replace('m', '')) < 0) return window.location.href = '/support'
            description.innerHTML = `<span class="text-warning">[ON COOLDOWN]</span> - your submission has not been sent. Please wait for ${cooldown.ms}.`
        }
        await updateDescription()
        setInterval(updateDescription, 1000)
    }

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