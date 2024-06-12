const toast = new bootstrap.Toast('#toast')
const message = document.getElementById('notificationMessage')
window.addEventListener('load', async () => {
    if (localStorage.getItem('UserLoggedIn') !== 'yes') {
        const key = prompt('Enter key')
        if (key) {
            const response = await fetch(`api/verify_owner`, {
                headers: { key }
            });
            const data = await response.json();
            if (data.status === 'success') {
                message.textContent = 'Hello, Nam! You have successfully logged in.'
                await toast.show()
                return localStorage.setItem('UserLoggedIn', 'yes')
            }
        }
        window.location.href = '/'
    } else {
        message.textContent = 'Welcome back, Nam!'
        await toast.show()
    }
})

window.addEventListener('keydown', (KEY) => {
    const { ctrlKey, key } = KEY
    if (ctrlKey && key === 'b') {
        const command = window.prompt('Enter command:')
        if (command) eval(`${command}()`)
    }
})

function logout() {
    localStorage.setItem('UserLoggedIn', 'no')
    window.location.reload()
}