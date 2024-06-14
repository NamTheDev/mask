const { check } = require("email-existence");
const { rest, recieveSupportMessageChannel, defaultColor, cooldown, cooldownConfig } = require("../config");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const { message, gmail } = req.query
    check(gmail, async function (error, response) {
        const dateInData = await cooldown.get(gmail) || Date.now()
        const dateCompare = dateInData - Date.now() > 0
        if (dateCompare) return res.redirect('/support?cooldown')
        else cooldown.set(gmail, Date.now()+cooldownConfig)
        if (response !== true) return res.redirect('/support?failed')
        else {
            try {
                await rest.post(`/channels/${recieveSupportMessageChannel}/messages`, {
                    body: {
                        embeds: [
                            {
                                title: 'A SUPPORT SUBMISSION HAS BEEN SENT.',
                                fields: [{
                                    name: 'Gmail',
                                    value: gmail
                                }, {
                                    name: 'Message',
                                    value: message
                                }, {
                                    name: 'Time',
                                    value: `<t:${Math.floor(Date.now() / 1000)}:R>`
                                }],
                                color: defaultColor
                            }
                        ]
                    },
                });
            } catch (error) {
                console.error(error);
            }
            res.redirect('/support?submitted')
        }
    });
}