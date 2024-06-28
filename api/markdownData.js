const { readdirSync, readFileSync } = require("fs")

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = async (req, res) => {
    const { folder } = req.query
    const markdownFolder = readdirSync('markdown').find(folderName => folderName.split('.')[0] === folder)
    const markdownData = readdirSync(`markdown/${markdownFolder}`)
        .map(markdownFile => {
            const name = markdownFile.split('-')[1]
            let content = readFileSync(`markdown/${markdownFolder}/${markdownFile}`, 'utf-8')
            const types = [{ type: 'tab', replaceWith: `<span class="mx-tabIndex"></span>` }, { type: 'down', replaceWith: '<br>' }]

            types.forEach(({ type, replaceWith }) => {
                const regex = new RegExp(`<\\$${type}(?:-(\\d+))?>`, 'g')
                content = content.replace(regex, (_, index) => {
                    const tabIndex = index || 2
                    let string = replaceWith
                    if (string.includes('tabIndex')) string = string.replace('tabIndex', tabIndex)
                    return string;
                })
            })

            return { name, content }
        })
    res.json(markdownData)
}
