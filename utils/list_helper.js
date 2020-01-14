
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
    // TODO 4.6
    return 1
}

const mostLikes = (blogs) => {
    // TODO 4.7
    return 1
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}