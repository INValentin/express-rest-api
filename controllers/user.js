import User from '../models/user';

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        console.log("Fetch users failed: \n", error);
        res.status(500).json({ error: "Can't fetch users" })
    }
}

export async function createUser(req, res) {
    try {
        const existingUser = await User.findOne({ username: req.body.username })
        if (existingUser) return res.status(400).json({error: 'User with that username exists.'})
        const user = new User({ ...req.body });
        await user.save()
        user.password = undefined
        res.status(201).json(user)
    } catch (error) {
        console.log("Can't create a user:\n")
        res.status(400).json({ error: error?.message || 'Can\'t create a user' })
    }
}


export async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) return res.status(404).json({ error: "User not found" })
        res.json(user)
    } catch (error) {
        console.log("Can't fetch a user: \n", error);
        res.status(500).json({ error: "Can't fetch users" })
    }
}

export async function updateUser(req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { ...req.body })
        if (!updatedUser) return res.status(404).json({ error: 'User not found' })
        res.json(await User.findById(req.params.id).select('-password'))
    } catch (error) {
        console.log("Can't update a user: \n", error);
        res.status(500).json({ error: "Can't update users" })
    }
}

export async function deleteUser(req, res) {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'User not found' })
        res.status(204).json('')
    } catch (error) {
        console.log("Can't delete a user: \n", error);
        res.status(500).json({ error: "Can't delete users" })
    }
}



