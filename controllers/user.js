const User = require('../models/user')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        console.log("Fetch users failed: \n", error);
        res.status(500).json({ error: "Can't fetch users" })
    }
}

exports.createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username })
        if (existingUser) return res.status(400).json({error: 'User with that username exists.'})
        const user = new User({ ...req.body });
        await user.save()
        res.json(user)
    } catch (error) {
        console.log("Can't create a user:\n")
        res.status(400).json({ error: error?.message || 'Can\'t create a user' })
    }
}


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: "User not found" })
        // res.json(user)
    } catch (error) {
        console.log("Can't fetch a user: \n", error);
        res.status(500).json({ error: "Can't fetch users" })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { ...req.body })
        if (!updatedUser) return res.status(404).json({ error: 'User not found' })
        res.json(await User.findById(req.params.id))
    } catch (error) {
        console.log("Can't update a user: \n", error);
        res.status(500).json({ error: "Can't update users" })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'User not found' })
        res.json(deleted.username + ' was deleted')
    } catch (error) {
        console.log("Can't delete a user: \n", error);
        res.status(500).json({ error: "Can't delete users" })
    }
}



