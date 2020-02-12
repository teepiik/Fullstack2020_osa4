const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')
const User = require('../models/User')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Video games',
        author: 'King',
        url: 'www.pingpong.com',
        likes: 1,
        userId: "5e1c67df48f4b72350a76f61"
    },
    {
        title: 'NHL blog',
        author: 'Pate',
        url: 'www.anari.com',
        likes: 3,
        userId: "5e1c67df48f4b72350a76f61"
    }
]

const dummyUser = {
    name: 'Dummy',
    username: 'Dumpsi',
    password: 'sikred'
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()

    await api
            .post('/api/users')
            .send(dummyUser)
})

describe('API GET testing', () => {
    test('Blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })

    test('All blogs are returned.', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length)
    })

    test('Blogs id is correctly formatted.', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
        expect(response.body[0]._id).not.toBeDefined()
    })
})

describe('API POST testing', () => {
    
    test('POST adds a blog', async () => {
        const res = await api.get('/api/users')
        const user = res.body[0]
        user._id = user.id

        const tokenres = await api
            .post('/api/login')
            .send({ username: 'Dumpsi', password: 'sikred' })
        const token = tokenres.body.token

        const newBlog = 
        {
            title: 'POSTED',
            author: 'Pateposter',
            url: 'www.posting.com',
            likes: 0,
            userId: user
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', 'bearer ' + token)
            .expect(200)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length + 1)
    })

    test('If likes are not given, then it is 0', async () => {
        const res = await api.get('/api/users')
        const user = res.body[0]
        user._id = user.id

        const tokenres = await api
            .post('/api/login')
            .send({ username: 'Dumpsi', password: 'sikred' })
        const token = tokenres.body.token

        const newBlog = 
        {
            title: 'POSTED',
            author: 'Pateposter',
            url: 'www.posting.com',
            userId: user
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', 'bearer ' + token)
            .expect(200)

        const response = await api.get('/api/blogs')
        expect(response.body[response.body.length - 1].likes).toBe(0)
    })

    test('If title is not given, then response is 400', async () => {
        const res = await api.get('/api/users')
        const user = res.body[0]
        user._id = user.id

        const tokenres = await api
            .post('/api/login')
            .send({ username: 'Dumpsi', password: 'sikred' })
        const token = tokenres.body.token

        const newBlog = 
        {
            author: 'Pateposter',
            url: 'www.posting.com',
            likes: 0,
            userId: user
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', 'bearer ' + token)
            .expect(400)
    })

    test('If url is not given, then response is 400', async () => {
        const res = await api.get('/api/users')
        const user = res.body[0]
        user._id = user.id

        const tokenres = await api
            .post('/api/login')
            .send({ username: 'Dumpsi', password: 'sikred' })
        const token = tokenres.body.token

        const newBlog = 
        {
            title: 'POSTED',
            author: 'Pateposter',
            likes: 4,
            userId: user
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', 'bearer ' + token)
            .expect(400)
    })

    test('No token gives 401 status', async () => {
        const res = await api.get('/api/users')
        const user = res.body[0]
        user._id = user.id

        const newBlog = 
        {
            title: 'POSTED',
            author: 'Pateposter',
            likes: 4,
            url: 'www',
            userId: user
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', 'bearer ')
            .expect(401)
    })
})

afterAll(() => {
    mongoose.connection.close()
})