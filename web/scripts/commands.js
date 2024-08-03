const searchInput = document.getElementById('searchInput')
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
const contentBox = document.getElementById('contentBox');
const commandsBox = document.getElementById('commandsBox');
const JSONButtons = document.getElementsByName('JSONButton');
const JSONDisplayBlock = document.getElementById('JSONDisplayBlock');
const optionTypesElement = document.getElementById('optionTypes');
const commandTypesElement = document.getElementById('commandTypes');
const searchButton = document.getElementById('searchIcon')
const footerLinks = document.getElementById('footerLinks');
const titles = document.getElementsByName('title');
const commandNames = document.getElementsByName('commandName')
const JSONModal = new bootstrap.Modal(document.getElementById('JSONModal'), {
    backdrop: 'static',
    keyboard: false
});
const COMMAND_TYPES = ['Chat Input', 'User', 'Message'];
const OPTION_TYPES = [
    "Sub Command", "Sub Command Group", "String", "Integer", "Boolean",
    "User", "Channel", "Role", "Mentionable", "Number", "Attachment"
];

(async () => {
    const commands = await (await fetch('api/commands')).json();
    const config = await (await fetch('/config.json')).json();

    const defaultLinksText = [...footerLinks.getElementsByClassName('nav-item')].map(link => link.innerHTML);

    function toggleClassList(element, largeClass, smallClass, isSmallScreen) {
        element.classList.replace(isSmallScreen ? largeClass : smallClass, isSmallScreen ? smallClass : largeClass);
    }

    function handleScreenWidthChange(event) {
        const isSmallScreen = event.matches;
        toggleClassList(contentBox, 'mx-5', 'mx-3', isSmallScreen);
        toggleClassList(contentBox, 'p-5', 'p-2', isSmallScreen);
        toggleClassList(commandsBox, 'mx-5', 'mx-3', isSmallScreen);
        toggleClassList(navbar, 'mx-5', 'mx-3', isSmallScreen);
        toggleClassList(footer, 'mx-5', 'mx-3', isSmallScreen);

        if (isSmallScreen) {
            var index = 0;
            for (const navitem of footerLinks.getElementsByClassName('nav-item')) {
                const link = navitem.getElementsByClassName('nav-link').item(0);
                link.innerHTML = config.footerIcons[index];
                const icon = footerLinks.getElementsByClassName('fa-solid').item(index);
                icon.classList.add('fs-5');
                index += 1;
            }
            footerLinks.classList.add('column-gap-2');
            footerLinks.classList.add('me-1');
        } else {
            var index = 0;
            for (const navitem of footerLinks.getElementsByClassName('nav-item')) {
                const link = navitem.getElementsByClassName('nav-link').item(0);
                link.innerHTML = defaultLinksText[index];
                index += 1;
            }
            footerLinks.classList.remove('column-gap-2');
            footerLinks.classList.remove('me-1');
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 650px)');
    mediaQuery.addEventListener("change", handleScreenWidthChange);

    // Initial check
    handleScreenWidthChange(mediaQuery);

    let delay = 0;
    async function appendCommandCard(command, index) {
        const { name, description, type } = command;
        const optionTypes = OPTION_TYPES.map((opt, i) => `${i + 1} = ${opt}`).join('\n');
        const commandTypes = COMMAND_TYPES.map((cmd, i) => `${i + 1} = ${cmd}`).join('\n');

        const commandCard = document.createElement('div');
        commandCard.className = 'bg-dark bg-opacity-25 rounded p-4 d-flex flex-column command-card';
        commandCard.innerHTML = `
            <h2 name="title">
                <span class="text-secondary-emphasis" style="font-size: 24px">${index + 1}. </span><span name="commandName">${name}</span>
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
        delay += index + 1 * 100;
        commandCard.style.setProperty('--transition-delay', `${delay}ms`);
        commandsBox.appendChild(commandCard);

        // Add the visible class after a short delay
        setTimeout(() => {
            commandCard.classList.remove('hidden');
            commandCard.classList.add('visible');
        }, 200);
    }
    let delayFade = 0;
    async function fadeCommandCards() {
        [...commandsBox.children].forEach((commandCard, index) => {
            commandCard
            delayFade += index + 1 * 100;
            commandCard.style.setProperty('--transition-delay', `${delayFade}ms`);
            commandCard.classList.add('hidden');
            commandCard.classList.remove('visible');
            setTimeout(() => { 
                commandCard.remove()
            }, delayFade*1.5)
        })
        delayFade = 0;
    }

    async function initializeCommands(commands) {
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

    initializeCommands(commands);

    async function search() {
        const { value } = searchInput;
        if (!value) {
            if(commandsBox.childElementCount <= 0) {
                commandsBox.innerHTML = ''
                await initializeCommands(commands);
            }
        };

        const regex = new RegExp(`(${value})`, 'gi');
        const listOfCommandsCard = commandsBox.children;

        for (const commandCard of listOfCommandsCard) {
            if (commandCard.nodeType !== 1) return; // Skip non-element nodes

            const titleElement = commandCard.querySelector('[name="title"]');
            if (titleElement && regex.test(titleElement.textContent)) {
                // Highlighting logic
                const highlightedText = titleElement.textContent.split(regex).map(part => {
                    if (regex.test(part)) {
                        return `<span class="bg-secondary bg-opacity-25">${part}</span>`;
                    }
                    return part;
                }).join('');

                // Update the title's innerHTML
                titleElement.innerHTML = highlightedText;
                const filteredCommands = commands.filter(({ name }) => name.startsWith(value))
                fadeCommandCards().then(async () => {
                    await initializeCommands(filteredCommands)
                })
            }
        };
    }

    searchButton.onclick = search;
    searchInput.onkeydown = ({ key }) => key && key === 'Enter' ? search() : null;
})();