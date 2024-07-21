const { consoleData } = require("../config")

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const {key} = req.query
    if(key !== process.env.SECRET_KEY) return;
    const {data} = consoleData
    if (data.length > 0) {
        res.json({ data: data.map(({ key, value }) => `<b>${key}</b>: ${value}<br>`).join('\n') })
    } else {
        res.json({ data: [] })
    }
}