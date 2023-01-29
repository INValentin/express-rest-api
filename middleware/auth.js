import User from '../models/user'


const authMiddleware =async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({error: 'Authentication failed'})
    const creds = Buffer.from(authHeader, 'base64').toString('ascii')
    const [username, password] = creds.split(':')
    // console.log({username, password});
    const user = await User.findOne({username})
    if (!user || user.password !== password) return res.status(401).json({error: 'Authentication failed'})
    req.user = user
    req.isAdmin = user.userType.toLocaleLowerCase() === "admin"
    next()
}

export default authMiddleware