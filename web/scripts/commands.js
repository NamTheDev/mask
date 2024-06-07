(async () => {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const contentBox = document.getElementById('contentBox');
    const commandsBox = document.getElementById('commandsBox');
    const JSONButton = document.getElementsByName('JSONButton');
    const JSONDisplayBLock = document.getElementById('JSONDisplayBLock')
    const optionTypes = document.getElementById('optionTypes')
    const commandTypes = document.getElementById('commandTypes')
    const JSONModal = new bootstrap.Modal(document.getElementById('JSONModal'), {
        backdrop: 'static',
        keyboard: false
    })
    const commands = await (await fetch('api/commands')).json();
    const COMMAND_TYPES = ['Chat Input', 'User', 'Message'];
    const OPTION_TYPES = ["Sub Command", "Sub Command Group", "String", "Integer", "Boolean", "User", "Channel", "Role", "Mentionable", "Number", "Attachment"];

    function handleScreenWidthChange(event) {
        if (event.matches) {
            contentBox.classList.replace('mx-5', 'mx-3');
            contentBox.classList.replace('p-5', 'p-2');
            commandsBox.classList.replace('mx-5', 'mx-3');
            navbar.classList.replace('mx-5', 'mx-3');
            footer.classList.replace('mx-5', 'mx-3');
        } else {
            contentBox.classList.replace('mx-3', 'mx-5');
            contentBox.classList.replace('p-2', 'p-5');
            commandsBox.classList.replace('mx-3', 'mx-5');
            navbar.classList.replace('mx-3', 'mx-5');
            footer.classList.replace('mx-3', 'mx-5');
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 650px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);

    // Adding command rows to the table
    commands.forEach((command, index) => {
        const { name, description, type } = command
        const optionTypes = []
        const commandTypes = []
        for (const optionType in OPTION_TYPES) {
            optionTypes.push(`${Number(optionType) + 1} = ${OPTION_TYPES[optionType]}`)
        }
        for (const commandType in COMMAND_TYPES) {
            commandTypes.push(`${Number(commandType) + 1} = ${COMMAND_TYPES[commandType]}`)
        }
        const commandCard = document.createElement('div')
        commandCard.className = 'bg-dark bg-opacity-25 rounded p-4 d-flex flex-column'
        commandCard.innerHTML = `<h2><span class="text-secondary-emphasis" style="font-size: 24px">${index + 1}. </span>${name}</h2><h5 class="text-secondary">${COMMAND_TYPES[Number(type) - 1]}</h5><p>${description}</p><hr class="mt-auto"><button class="btn btn-dark border border-0" json="${encodeURI(JSON.stringify(command, null, '·'))}" name="JSONButton" commandTypes="${commandTypes.join('\n')}" optionTypes="${optionTypes.join('\n')}">View JSON data</button>`
        commandCard.style.width = '250px'
        commandsBox.appendChild(commandCard)
    })
    for (const button of JSONButton) {
        button.addEventListener('click', () => {
            const json = button.getAttribute('json')
            const optionTypesString = button.getAttribute('optionTypes')
            const commandTypesString = button.getAttribute('commandTypes')
            optionTypes.innerHTML = optionTypesString
            commandTypes.innerHTML = commandTypesString
            JSONDisplayBLock.innerHTML = decodeURI(json).split('·').join(' ')
            JSONModal.show()
            hljs.highlightElement(JSONDisplayBLock);
            hljs.highlightElement(commandTypes);
            hljs.highlightElement(optionTypes);
            JSONDisplayBLock.removeAttribute('data-highlighted')
            commandTypes.removeAttribute('data-highlighted')
            optionTypes.removeAttribute('data-highlighted')
        })
    }
})();
