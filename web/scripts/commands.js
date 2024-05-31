(async () => {
    const contentBox = document.getElementById('contentBox')
    const optionModalButtons = document.getElementsByName('optionModalButton')
    const commands = await (await fetch('/api/commands')).json()
    const optionsBox = document.getElementById('optionsBox')
    const COMMAND_TYPES = ['Chat Input', 'User', 'Message']
    const OPTION_TYPES = ["Sub Command", "Sub Command Group", "String", "Integer", "Boolean", "User", "Channel", "Role", "Mentionable", "Number", "Attachment"];
    for (const { name, description, type } of commands) {
        contentBox.innerHTML += `
        <div class="card bg-black bg-opacity-75" style="width: 300px">
            <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${COMMAND_TYPES[Number(type) - 1]}</h6>
            <p class="card-text">${description}</p>
            <hr>
            <button type="button" class="btn btn-dark bg-black bg-opacity-50" data-bs-toggle="modal" data-bs-target="#optionsModal" name="optionModalButton" command-name= "${name}">Options</button>
          </div>
        </div>
                `
    }
    for (const optionModalButton of optionModalButtons) {
        optionModalButton.addEventListener('click', () => {
            const commandName = optionModalButton.getAttribute('command-name');
            const { options } = commands.find(({ name }) => name === commandName)
            if (options) {
                optionsBox.innerHTML = options.map(({ name, description, type, required }) => `
                    <div class="card bg-black bg-opacity-75" style="width: 300px">
    <div class="card-body">
    <h5 class="card-title">${name}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">${OPTION_TYPES[Number(type) - 1]}</h6>
    <p class="card-text">${description}</p>
    <hr>
    ${type === 1 ? '' : `<p><b>${required ? "Required." : "Not required."}</b></p>`}
  </div>
</div>
                    `).join('')
            } else return optionsBox.innerHTML = "None."
        })
    }
})()