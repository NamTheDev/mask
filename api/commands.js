const { rest, botID } = require("../config")
const commands = require('../json/commands.json')

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    // return res.json(commands)
    try {
        const data = await rest.get(`/applications/${botID}/commands`)
        res.json(data)
    } catch (e) {
        res.json(commands)
    }
}