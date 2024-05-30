const { REST } = require("@discordjs/rest")
module.exports = {
    rest: new REST({ version: '10' }).setToken(process.env.TOKEN),
    botID: '1202507536838828083'
}