const blogRouter = require('express').Router()
const Blog = require('../models/Blog')

blogRouter.get('/', (req, res) => {
    Blog.find({}).then(blogs => {
        res.json(blogs.map(blog => blog.toJSON()))
    })
})

module.exports = blogRouter