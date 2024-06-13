/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const { message } = req.query
    console.log(message)
    res.redirect('/support?submitted')
}