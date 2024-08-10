const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
const contentBox = document.getElementById('contentBox');
const commandsBox = document.getElementById('commandsBox');
const JSONButtons = document.getElementsByName('JSONButton');
const JSONDisplayBlock = document.getElementById('JSONDisplayBlock');
const optionTypesElement = document.getElementById('optionTypes');
const commandTypesElement = document.getElementById('commandTypes');
const searchButton = document.getElementById('searchIcon');
const footerLinks = document.getElementById('footerLinks');
const commandNames = document.getElementsByName('commandName');
const commandsTableBody = document.getElementById('commandsTableBody');
const JSONModal = new bootstrap.Modal(document.getElementById('JSONModal'), {
    backdrop: 'static',
    keyboard: false
});
const COMMAND_TYPES = ['Chat Input', 'User', 'Message'];
const OPTION_TYPES = [
    "Sub Command", "Sub Command Group", "String", "Integer", "Boolean",
    "User", "Channel", "Role", "Mentionable", "Number", "Attachment"
];
const commandTypesObject = {}
const optionTypesObject = {}

COMMAND_TYPES.forEach((name, index) => commandTypesObject[index + 1] = name)
OPTION_TYPES.forEach((name, index) => optionTypesObject[index + 1] = name)

optionTypesElement.innerHTML = JSON.stringify(commandTypesObject, null, 3);
commandTypesElement.innerHTML = JSON.stringify(optionTypesObject, null, 3);
(async () => {
    const commands = await (await fetch('api/commands')).json();
    const config = await (await fetch('/config.json')).json();

    const defaultLinksText = [...footerLinks.getElementsByClassName('nav-item')].map(link => link.innerHTML);

    function initializeCommands() {
        for (const index in commands) {
            const command = commands[index]
            const { name, description, type } = command
            commandsTableBody.innerHTML += `<tr>
                        <td>${name}</td>
                        <td>${description}</td>
                        <td>${COMMAND_TYPES[type]}</td>
                        <td>
                        <button class="btn btn-outline-light btn-sm" style="width: 2rem; height: 2rem;" name="JSONButton" json="${encodeURI(JSON.stringify(command, null, 3))}"><i class="fa-solid fa-up-right-from-square"></i></button>
                        <div class="json-data" id="ping-json"></div>
                        </td>
                        <td>${Number(index) + 1}</td>
                </tr>`
        }
        for (const button of JSONButtons) {
            button.addEventListener('click', () => {
                const json = button.getAttribute('json');
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

    initializeCommands(commands);
    handleScreenWidthChange(mediaQuery);
    playPageTransition('in');
})();