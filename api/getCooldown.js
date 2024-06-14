const ms = require("ms")
const { cooldown } = require("../config")
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const cooldownNumber = await cooldown.get(req.query.gmail) || Date.now()-1
    res.json({ ms: ms(cooldownNumber - Date.now()) })
}