(async () => {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const contentBox = document.getElementById('contentBox');
    const commandsBox = document.getElementById('commandsBox');
    const JSONButtons = document.getElementsByName('JSONButton');
    const JSONDisplayBlock = document.getElementById('JSONDisplayBlock');
    const optionTypesElement = document.getElementById('optionTypes');
    const commandTypesElement = document.getElementById('commandTypes');
    const JSONModal = new bootstrap.Modal(document.getElementById('JSONModal'), {
        backdrop: 'static',
        keyboard: false
    });
    const commands = await (await fetch('api/commands')).json();
    const COMMAND_TYPES = ['Chat Input', 'User', 'Message'];
    const OPTION_TYPES = [
        "Sub Command", "Sub Command Group", "String", "Integer", "Boolean",
        "User", "Channel", "Role", "Mentionable", "Number", "Attachment"
    ];

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

    async function appendCommandCard(command, index) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { name, description, type } = command;
        const optionTypes = OPTION_TYPES.map((opt, i) => `${i + 1} = ${opt}`).join('\n');
        const commandTypes = COMMAND_TYPES.map((cmd, i) => `${i + 1} = ${cmd}`).join('\n');

        const commandCard = document.createElement('div');
        commandCard.className = 'bg-dark bg-opacity-25 rounded p-4 d-flex flex-column command-card';
        commandCard.innerHTML = `
            <h2>
                <span class="text-secondary-emphasis" style="font-size: 24px">${index + 1}. </span>${name}
            </h2>
            <h5 class="text-secondary">${COMMAND_TYPES[Number(type) - 1]}</h5>
            <p>${description}</p>
            <hr class="mt-auto">
            <button 
                class="btn btn-dark border border-0" 
                json="${encodeURI(JSON.stringify(command, null, '·'))}" 
                name="JSONButton" 
                commandTypes="${commandTypes}" 
                optionTypes="${optionTypes}">
                View JSON data
            </button>`;
        commandCard.style.width = '250px';
        commandsBox.appendChild(commandCard);

        // Add the visible class after a short delay
        setTimeout(() => {
            commandCard.classList.add('visible');
        }, 100);
    }

    async function initializeCommands() {
        for (const [index, command] of commands.entries()) {
            await appendCommandCard(command, index);
        }

        for (const button of JSONButtons) {
            button.addEventListener('click', () => {
                const json = button.getAttribute('json');
                const optionTypesString = button.getAttribute('optionTypes');
                const commandTypesString = button.getAttribute('commandTypes');
                optionTypesElement.innerHTML = optionTypesString;
                commandTypesElement.innerHTML = commandTypesString;
                JSONDisplayBlock.innerHTML = decodeURI(json).split('·').join(' ');
                JSONModal.show();
                hljs.highlightElement(JSONDisplayBlock);
                hljs.highlightElement(commandTypesElement);
                hljs.highlightElement(optionTypesElement);
                JSONDisplayBlock.removeAttribute('data-highlighted');
                commandTypesElement.removeAttribute('data-highlighted');
                optionTypesElement.removeAttribute('data-highlighted');
            });
        }
    }

    initializeCommands();
})();
