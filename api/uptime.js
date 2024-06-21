/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const { secret } = req.query
    if (secret === process.env.SECRET_KEY) console.log('SUCCESSFULY UPTIMED.')
    res.redirect('/')
}