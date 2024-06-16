(async () => {
    const toast = new bootstrap.Toast('#toast')
    const message = document.getElementById('notificationMessage')
    const modal = new bootstrap.Modal('#modal')
    const input = document.getElementById('suggestion-input');
    const suggestionBox = document.getElementById('inline-suggestion');
    const contentBox = document.getElementById('contentBox');
    const navbar = document.getElementById('navbar');
    const suggestionsBox = document.getElementById('suggestion-box')

    function handleScreenWidthChange(event) {
        if (event.matches) {
            // Screen width is less than 650px
            contentBox.classList.replace('mx-5', 'mx-2');
            contentBox.classList.replace('p-5', 'p-3');
            navbar.classList.replace('p-4', 'p-2');
            navbar.classList.replace('mx-5', 'mx-2');
        } else {
            // Screen width is 650px or greater
            contentBox.classList.replace('mx-2', 'mx-5');
            contentBox.classList.replace('p-2', 'p-4');
            navbar.classList.replace('p-3', 'p-5');
            navbar.classList.replace('mx-2', 'mx-5');
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 650px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);
    if (localStorage.getItem('UserLoggedIn') !== 'yes') {
        let key = prompt('Enter key')
        if (key) {
            const response = await fetch(`api/verifyOwner`, {
                headers: { key }
            });
            const data = await response.json();
            if (data.status === 'success') {
                localStorage.setItem('UserLoggedIn', 'yes')
                return window.location.reload()
            }
        }
        window.location.href = '/'
    } else {
        message.textContent = 'Welcome back, Nam!'
        await toast.show()
    }


    window.addEventListener('keydown', async (KEY) => {
        const { ctrlKey, key } = KEY
        if (ctrlKey && key === 'b') {
            await modal.show()
            input.focus()
        }
    })

    const functions = [
        function logout() {
            localStorage.setItem('UserLoggedIn', 'no')
            window.location.reload()
        }
    ]

    const descriptions = {
        'logout': 'log out of the owner dashboard.'
    }

    const suggestions = functions.map(func => func.name);
    input.addEventListener('keydown', async (key) => {
        if (key.code === 'Tab' && suggestionBox.textContent) {
            key.preventDefault();
            input.value = suggestionBox.textContent;
            suggestionBox.textContent = '';
        }
        if (key.ctrlKey && key.code === 'KeyA') {
            localStorage.setItem('CTRL+A', 'yes')
        }
        if (key.code === 'Backspace') {
            if (input.value.length === 1 || localStorage.getItem('CTRL+A') === 'yes') {
                suggestionsBox.innerHTML = 'No result found.';
                suggestionBox.innerHTML = '';
                localStorage.setItem('CTRL+A', 'no')
            }
        }
        if (key.code === 'Enter') {
            const command = functions.find(func => func.name.toLowerCase() === input.value.toLowerCase())
            if (command) {
                try {
                    command()
                    await modal.hide()
                    input.value = ''
                    suggestionsBox.innerHTML = ''
                    suggestionBox.innerHTML = ''
                } catch (error) {
                    message.innerHTML = `<b>Error while trying to run command</b>:<br><span class="text-danger">${error}</span>`
                    await toast.show()
                }
            }
        }
    })
    input.addEventListener('input', async () => {
        const values = input.value.toLowerCase().split(' ').filter(str => /\w+/.test(str));
        for (const value of values) {
            const availableSuggestions = suggestions.filter(name => name.toLowerCase().startsWith(value.toLowerCase()));
            if (availableSuggestions.length > 0) {
                suggestionsBox.innerHTML = availableSuggestions.map(name => `<button onclick="setInput('${name}')" class='bg-secondary bg-opacity-25 p-2 rounded d-flex border border-0 hover m-1'><div class="px-1 border rounded-circle me-1"><i class="fa-solid fa-code" style="font-size: 15px"></i></div><b>${name}</b><span class='mx-2'>-</span><span class="text-secondary">${descriptions[name] || 'no description.'}</span></button>`).join('')
                const filledValue = availableSuggestions[0].substring(value.length);
                suggestionBox.innerHTML = `<span style="color: transparent">${input.value}</span>` + filledValue;
            } else {
                suggestionsBox.innerHTML = 'No result found.';
                suggestionBox.innerHTML = '';
            }
        }
    });
})()

function setInput(name) {
    const input = document.getElementById('suggestion-input')
    const suggestionBox = document.getElementById('inline-suggestion')
    const suggestionsBox = document.getElementById('suggestion-box')
    for (const suggestion of suggestionsBox.children) {
        const commandName = suggestion.getElementsByTagName('b')[0].textContent
        if (commandName === name) {
            console.log(suggestion)
            suggestionsBox.innerHTML = ''
            suggestionsBox.appendChild(suggestion)
            break;
        }
    }
    const filledValue = name.substring(name.length);
    input.value = name
    suggestionBox.innerHTML = `<span style="color: transparent">${name}</span>` + filledValue;
}