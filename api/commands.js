const { rest, botID } = require("../config")

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const data = await rest.get(`/applications/${botID}/commands`)
    res.json(data)
}