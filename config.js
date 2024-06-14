const { REST } = require("@discordjs/rest")
const { textDatabase } = require("multi-purpose")
const ms = require("ms");
module.exports = {
    rest: new REST({ version: '10' }).setToken(process.env.TOKEN),
    botID: '1202507536838828083',
    recieveSupportMessageChannel: '1242693881636720661',
    defaultColor: 15548997,
    cooldown: new textDatabase('reportSubmissionCooldown'),
    cooldownConfig: ms('1 day')
}