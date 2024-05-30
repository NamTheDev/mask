(async () => {
    const contentBox = document.getElementById('contentBox')
    const commands = await (await fetch('/api/commands')).json()
    const COMMAND_TYPE = ['Chat Input', 'User', 'Message']
    for (const { name, description, type } of commands) {
        contentBox.innerHTML += `
<div class="card bg-black bg-opacity-75" style="width: 18rem;">
    <div class="card-body">
    <h5 class="card-title">${name}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">${COMMAND_TYPE[type]}</h6>
    <p class="card-text">${description}</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
        `
    }
})()