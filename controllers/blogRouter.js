const blogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Base url is set to /api/blogs
blogRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({}).populate('user')
    res.json(blogs.map(b => b.toJSON()))
})

blogRouter.put('/:id', async (req, res, next) => {
    const body = req.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.userId
    }
    try {
        updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new:true})
        res.json(updatedBlog.toJSON())

    } catch (error) {
        next(error)
    }
})

blogRouter.post('/', async (req, res, next) => {
    const body = req.body
    
    try{
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if(!req.token || !decodedToken.id) {
            return res.status(401).json({ error: 'Token missing or invalid.'})
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user
        })

        if(blog.likes === undefined) {
            blog.likes = 0
        }

        if(blog.title === undefined || blog.url === undefined) {
            res.status(400).end()
        }

        savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.json(savedBlog.toJSON())
        
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if(!req.token || !decodedToken.id) {
            return res.status(401).json({ error: 'Token missing or invalid.'})
        }

        const user = await User.findById(decodedToken.id)
        const blogToDel = await Blog.findById(req.params.id)

        if(user._id.toString() !== blogToDel.user.toString()) {
            return res.status(401).json({ error: 'You dont have right to delete this blog.'})
        }

        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()

    } catch (error) {
        next(error)
    }
})

blogRouter.post('/:id/comments', async (req, res, next) => {
    const body = req.body
    
    try{
        let comments = []

        const blogToComment = await Blog.findById(req.params.id)
        if(blogToComment.comments) {
            comments = blogToComment.comments
        }
        comments = comments.concat(body.comment)
        const commented = {
            title: blogToComment.title,
            author: blogToComment.author,
            url: blogToComment.url,
            likes: blogToComment.likes,
            user: blogToComment.user,
            comments: comments
        }

        const updated = await Blog.findByIdAndUpdate(req.params.id, commented, {new:true})
        
        res.json(updated.toJSON())
        
    } catch (error) {
        next(error)
    }
})

module.exports = blogRouter