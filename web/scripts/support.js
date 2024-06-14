(async () => {
    const supportMessageBox = document.getElementById('textarea')
    const gmailInput = document.getElementById('gmailInput')
    const gmailInputBox = document.getElementById('gmailInputBox')
    const submitButton = document.getElementById('submitButton')
    submitButton.removeAttribute('disabled')
    const editButton = document.getElementById('editButton')
    const config = await (await fetch('/config.json')).json()
    const url = window.location.href
    const description = document.getElementById('description')
    if (url.includes('?submitted')) {
        submitButton.style.display = 'none';
        supportMessageBox.style.display = 'none';
        gmailInputBox.style.display = 'none';
        description.textContent = 'Your submission has been delivered! Thank you for contacting us.'

    } else if (url.includes('?failed')) {
        submitButton.style.display = 'none';
        supportMessageBox.style.display = 'none';
        gmailInputBox.style.display = 'none';
        editButton.style.display = '';
        description.innerHTML = '<span class="text-danger">[INVALID EMAIL]</span> - your submission has not been sent.<br>Please check your email address carefully before submitting.'
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

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    submitButton.addEventListener('click', () => {
        localStorage.setItem('gmail', gmailInput.value)
        localStorage.setItem('supportMessage', supportMessageBox.value)
        if (!validateEmail(gmailInput.value)) supportMessageBox.classList.add('is-invalid')
        else if (supportMessageBox.value.length < config.supportMessageMaxValue) supportMessageBox.classList.add('is-invalid')
        else {
            window.location.href = `/api/submit_support?message=${encodeURI(supportMessageBox.value)}&gmail=${encodeURI(gmailInput.value)}`
            submitButton.toggleAttribute('disabled')
        }
    })

    gmailInput.addEventListener('input', () => {
        if (gmailInput.className.includes('is-invalid')) gmailInput.classList.remove('is-invalid')
        if (validateEmail(gmailInput.value)) {
            const slicedValue = gmailInput.value.split('@gmail.com')
            if (slicedValue[0].length < 3) return gmailInput.classList.add('is-invalid')
        } else gmailInput.classList.add('is-invalid')
    })

    supportMessageBox.addEventListener('input', () => {
        if (supportMessageBox.className.includes('is-invalid')) supportMessageBox.classList.remove('is-invalid')
        if (supportMessageBox.value.length >= config.supportMessageMaxValue) supportMessageBox.classList.add('is-valid')
        else supportMessageBox.classList.remove('is-valid')
    })
})()