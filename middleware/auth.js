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

export async function isAdmin(req, res, next) {
    if (req.isAdmin === true) return next()
    if (req.user) {
        return res.status(403).json({error: 'Access denied. Admin only action.'})
    }
    
    return res.status(401).json({error: 'You\'re not authenticated!'})
}

export default authMiddleware