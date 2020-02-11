
/* These functions are for testing practise purpouse only */

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totalLikes = 0
    blogs.forEach(blog => totalLikes += blog.likes)
    return totalLikes
}

const favoriteBlog = (blogs) => {
    let favoriteBlog = {'likes': 0, 'title': 'Dummy'}

    blogs.forEach(blog => {
        if(blog.likes > favoriteBlog.likes) {
            favoriteBlog = blog
        }
    })

    return favoriteBlog
}

const mostBlogs = (blogs) => {
    let bloggers = {}
    blogs.forEach(blog => {
        if(blog.author in bloggers) {
            bloggers[blog.author] += 1
        } else {
            bloggers[blog.author] = 1
        }
    })
    const highestKey = Object.keys(bloggers).reduce((a, b) => bloggers[a] > bloggers[b] ? a : b)
    return { author: highestKey, blogs: bloggers[highestKey]}
}

const mostLikes = (blogs) => {
    let bloggers = {}
    blogs.forEach(blog => {
        if(blog.author in bloggers) {
            bloggers[blog.author] = bloggers[blog.author] + blog.likes
        } else {
            bloggers[blog.author] = blog.likes
        }
    })
    const highestKey = Object.keys(bloggers).reduce((a, b) => bloggers[a] > bloggers[b] ? a : b)
    return { author: highestKey, likes: bloggers[highestKey]}
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}