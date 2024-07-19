const { consoleData } = require("../config")

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const {author, message, key} = req.query
    if(key !== process.env.SECRET_KEY) return;
    consoleData.set(author, message)
    res.json({status: 'Message sent to console.'})
}