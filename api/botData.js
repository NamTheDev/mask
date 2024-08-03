const { Routes } = require("discord-api-types/v10");
const { rest, botID } = require("../config");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    try {
        
        const [serverCount, userCount, commandCount, botData] = await Promise.all([
            rest.get(Routes.userGuilds()).then(guilds => guilds.length),
            rest.get(Routes.userConnections()).then(connections => connections.length),
            rest.get(Routes.applicationCommands(botID)).then(commands => commands.length),
            rest.get('/applications/@me')
        ]);

        const data = {
            serverCount,
            userCount,
            commandCount,
            botData
        };

       res.json(data)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
