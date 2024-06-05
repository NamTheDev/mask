const { rest } = require("../config")
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const botAvatarURL = `https://cdn.discordapp.com/avatars/1202507536838828083/${(await rest.get('/applications/@me')).bot.avatar}.gif?size=4096`
    res.redirect(botAvatarURL)
}