const supportMessageBox = document.getElementById('textarea')
const submitButton = document.getElementById('submitButton')
const url = window.location.href
submitButton.addEventListener('click', () => {
    if (supportMessageBox.value.length < 50) {
        supportMessageBox.classList.add('is-invalid')
    }
})
supportMessageBox.addEventListener('input', () => {
    if (supportMessageBox.value.length >= 50) {
        if(supportMessageBox.className.includes('is-invalid')) supportMessageBox.classList.remove('is-invalid')
        supportMessageBox.classList.add('is-valid')
    }
})