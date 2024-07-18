const { cooldown } = require("../config")

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const cooldownValue = await cooldown.get(req.query.gmail)
    res.json({ status: cooldownValue ? true : false })
}