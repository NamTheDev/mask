/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const { key } = req.headers;
    const status = key === process.env.SECRET_KEY ? 'success' : 'denied';
    res.json({ status });
}