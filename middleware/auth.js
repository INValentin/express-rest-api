import User from '../models/user'


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader === "") {
        return res.status(401).json({ error: 'Authentication failed' })
    }
    const token = authHeader.split(" ")[1] || ""
    const creds = Buffer.from(token, 'base64').toString('ascii')
    const [username, password] = creds?.split(':') || []
    if (!username || !password) {
        return res.status(401).json({ error: 'Authentication failed' })
    }
    const user = await User.findOne({ username, password })
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Authentication failed' })
    }
    req.user = user
    req.isAdmin = user.userType.toLocaleLowerCase() === "admin"
    next()
}

export default authMiddleware