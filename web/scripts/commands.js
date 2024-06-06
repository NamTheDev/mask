(async () => {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const contentBox = document.getElementById('contentBox');
    const commandsBox = document.getElementById('commandsBox');
    const JSONButton = document.getElementsByName('JSONButton');
    const JSONDisplayBLock = document.getElementById('JSONDisplayBLock')
    const JSONModal = new bootstrap.Modal(document.getElementById('JSONModal'), {
        backdrop: 'static',
        keyboard: false
    })
    const commands = await (await fetch('api/commands')).json();
    for (const command of commands) {
        if (!command.options) continue;
        command.subCommandGroups = command.options.filter(({ type }) => type === 2)
        command.subCommands = command.options.filter(({ type }) => type === 1)
        command.subCommandOptions = []
        if (command.subCommandGroups.length > 0) {
            for (const subCommandGroup of command.subCommandGroups) {
                for (const subCommand of subCommandGroup.options) {
                    subCommand.parent = subCommandGroup.name
                    command.subCommands.push(subCommand)
                    if (subCommand.options) {
                        for (const option of subCommand.options) {
                            option.parent = subCommand.name
                            command.subCommandOptions.push(option)
                        }
                    }
                }
            }
        } else if (command.subCommands.length > 0) {
            for (const subCommand of command.subCommands) {
                if (!subCommand.options) continue;
                for (const option of subCommand.options) {
                    option.parent = subCommand.name
                    command.subCommandOptions.push(option)
                }
            }
        }
    }
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
        const { name, description, type, subCommands, subCommandGroups } = command
        const commandCard = document.createElement('div')
        commandCard.className = 'bg-dark bg-opacity-25 rounded p-4 d-flex flex-column'
        const additonalString = []
        if (subCommandGroups) {
            for (const subCommandGroup of subCommandGroups) {
                for (const subCommand of subCommands) {
                    if (subCommand.parent === subCommandGroup.name) {
                        additonalString.push(`${subCommandGroup.name} ${subCommand.name}`)
                    }
                }
            }
        }
        if (subCommands) {
            for (const { name } of subCommands) {
                additonalString.push(name)
            }
        }
        commandCard.innerHTML = `<h2><span class="text-secondary-emphasis" style="font-size: 24px">${index + 1}. </span>${name}</h2><h5 class="text-secondary">${COMMAND_TYPES[Number(type) - 1]}</h5><p>${description}</p>${additonalString.map(string => `<div class='bg-black bg-opacity-75 p-2 mt-3 rounded'>/${name} ${string}</div>`).join('')}<hr><button class="btn btn-dark border border-0" json="${encodeURI(JSON.stringify(command, null, '·'))}" name="JSONButton">View JSON data</button>`
        commandCard.style.width = '250px'
        commandsBox.appendChild(commandCard)
    })
    for (const button of JSONButton) {
        button.addEventListener('click', () => {
            const json = button.getAttribute('json')
            JSONDisplayBLock.innerHTML = decodeURI(json).split('·').join(' ')
            JSONModal.show()
            hljs.highlightElement(JSONDisplayBLock);
            JSONDisplayBLock.removeAttribute('data-highlighted')
        })
    }
})();
