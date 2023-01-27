const User = require('../models/user')


exports.createToken = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user || user.password !== password) return res.status(401).json({ error: "Incorrect username or password" })
        const token = Buffer.from(`${username}:${password}`).toString('base64')
        res.json({token})
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
        console.log("\nCan't login\n", error)
    }
}