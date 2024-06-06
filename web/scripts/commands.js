(async () => {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const contentBox = document.getElementById('contentBox');
    const commandsBox = document.getElementById('commandsBox')
    const commands = await (await fetch('api/commands')).json();
    for (const command of commands) {
        const options = command.options
        if (!options) continue;
        if (options.find(option => option.type !== 2)) continue;
        command.subCommandGroups = []
        for (const option of options) {
            command.subCommandGroups.push(option);
            if (option.options.find(option => option.type !== 1)) continue;
            command.subCommands = []
            for (const subCommand of option.options) {
                command.subCommands.push(subCommand);
                for (const subCommandOption of subCommand.options) {
                    command.subCommandOptions.push(subCommandOption)
                }
            }
        }
        command.options = undefined
    }
    for (const command of commands) {
        const options = command.options
        if (!options) continue;
        if (options.find(option => option.type !== 1)) continue;
        command.subCommandOptions = []
        command.subCommands = []
        for (const option of options) {
            command.subCommands.push(option);
            if(!option.options) continue;
            console.log(option)
            for (const subCommandOption of option.options) {
                command.subCommandOptions.push(subCommandOption)
            }
        }
        command.options = undefined
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
    commands.forEach(({ name, description, type, options, subCommands, subCommandGroups, subCommandOptions }, index) => {
        const commandCard = document.createElement('div')
        commandCard.className = 'bg-dark bg-opacity-75 rounded p-4 d-flex flex-column text-center'
        const additonalString = []
        if (options) {
            for (const { name } of options) {
                additonalString.push(`[${name}]`)
            }
        }
        if (subCommandGroups) {
            for (const { name } of subCommandGroups) {
                additonalString.push(name)
            }
        }
        if (subCommands) {
            for (const { name } of subCommands) {
                additonalString.push(name)
            }
        }
        if(subCommandOptions) {
            for (const {name} of subCommandOptions) {
                additonalString.push(`[${name}]`)
            }
        }
        commandCard.innerHTML = `<h2>${name}</h2><h5 class="text-secondary">${COMMAND_TYPES[Number(type) - 1]}</h5><strong>${description}</strong><div class='bg-black bg-opacity-75 p-2 mt-3 rounded'>/${name} ${additonalString.join(' ')}</div>`
        commandCard.style.width = '250px'
        commandsBox.appendChild(commandCard)
    })
})();
