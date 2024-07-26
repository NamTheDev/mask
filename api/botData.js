const { Routes } = require("discord-api-types/v10");
const { rest, botID } = require("../config");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    try {
        const { requested } = req.query;
        
        const [serverCount, userCount, botData] = await Promise.all([
            rest.get(Routes.userGuilds()).then(guilds => guilds.length),
            rest.get(Routes.userConnections()).then(connections => connections.length),
            rest.get('/applications/@me')
        ]);

        const botAvatarURL = `https://cdn.discordapp.com/avatars/${botID}/${botData.bot.avatar}.gif?size=4096`;

        const data = {
            serverCount,
            userCount,
            botAvatarURL
        };

        if (requested in data) {
            if (typeof data[requested] === 'number') {
                res.json({ count: data[requested] });
            } else {
                res.redirect(data[requested]);
            }
        } else {
            res.status(400).json({ error: "Invalid request" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
