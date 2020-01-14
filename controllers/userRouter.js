const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/User')

// Base url is set to /api/users
userRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync('body.password', salt)
        // may need to be async

        if(body.username.length < 3) {
            res.statusMessage = 'Username length must be at least 3.'
            res.status(400).end()
        }

        if(body.password.length < 3) {
            res.statusMessage = 'Password length must be at least 3.'
            res.status(400).end()
        }

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()
        res.json(savedUser)
    
    } catch (exception) {
        next(exception)
    }
})

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.json(users.map(u => u.toJSON()))
})

module.exports = userRouter