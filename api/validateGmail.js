const { check } = require("email-existence");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const { gmail } = req.query
    check(gmail, async function (error, response) {
        res.json({ response })
    })
}