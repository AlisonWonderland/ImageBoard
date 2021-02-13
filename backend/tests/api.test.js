const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Comment = require('../models/Comment')
const Thread = require('../models/Thread')

jest.setTimeout(100000)

describe('thread tests', () => {
    beforeAll(async () => {
        await Thread.deleteMany({})

        const initialThreads = await helper.initialThreads()
        const threadObjects = initialThreads
            .map(thread => new Thread(thread))
        const promiseArray = threadObjects.map(thread => thread.save())
        
        await Promise.all(promiseArray)
    })

    test('get all threads', async () => {
        await api
            .get('/api/threads')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('post a thread with photo', async () => {
        await api
            .post('/api/threads')
            .field('postType', 'thread')
            .field('text', 'The third post. I love weeekkly.')
            .attach('file', 'jest_test_pic.jpg')
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const threads = await api
            .get('/api/threads')

        expect(threads.body.length).toBe(3)
    })

    test('post a thread with gif', async () => {
        await api
            .post('/api/threads')
            .field('postType', 'thread')
            .field('text', 'The fourth post. I love BTS.')
            .attach('file', 'jest_test_gif.gif')
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const threads = await api
            .get('/api/threads')

        expect(threads.body.length).toBe(4)
    })

    test('post a thread with webm', async () => {
        await api
            .post('/api/threads')
            .field('postType', 'thread')
            .field('text', 'Why are you reading my tests?')
            .attach('file', 'jest_test_webm.webm')
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const threads = await api
            .get('/api/threads')

        expect(threads.body.length).toBe(5)
    })
})

describe('comment tests', () => {
    beforeAll(async () => {
        await Thread.deleteMany({})
        await Comment.deleteMany({})

        const initialThreads = await helper.initialThreads()
        const threadObjects = initialThreads
            .map(thread => new Thread(thread))
        const promiseArray = threadObjects.map(thread => thread.save())
        
        await Promise.all(promiseArray)
    })

    test('get all comments', async () => {
        await api
            .get('/api/comment')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    describe('post comments(not replies)', () => {
        test('post a comment with just text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'comment')
                .field('text', 'Bro this thread sucks. I hate twice')
                .field('parent', 1)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        })
        test('post a comment with picture and text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'comment')
                .field('text', 'ok then')
                .field('parent', 1)
                .attach('file', './jest_test_pic.jpg')
                .expect(201)
                .expect('Content-Type', /application\/json/)

        })
        test('post a comment with webm and text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'comment')
                .field('text', 'ok then2')
                .field('parent', 1)
                .attach('file', './jest_test_webm.webm')
                .expect(201)
                .expect('Content-Type', /application\/json/)
        })
        test('post a comment with gif and text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'comment')
                .field('text', 'ok then3')
                .field('parent', 1)
                .attach('file', './jest_test_gif.gif')
                .expect(201)
                .expect('Content-Type', /application\/json/)
        })
    })

    describe('post replies', () => {
        test('post a reply with just text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'reply')
                .field('text', 'Bro this thread sucks. I hate twice')
                .field('parent', 1)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        })
        test('post a reply with picture and text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'reply')
                .field('text', 'ok then')
                .field('parent', 1)
                .attach('file', './jest_test_pic.jpg')
                .expect(201)
                .expect('Content-Type', /application\/json/)

        })
        test('post a reply with webm and text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'reply')
                .field('text', 'ok then2')
                .field('parent', 1)
                .attach('file', './jest_test_webm.webm')
                .expect(201)
                .expect('Content-Type', /application\/json/)

        })
        test('post a reply with gif and text', async () => {
            await api
                .post('/api/comment')
                .field('postType', 'reply')
                .field('text', 'ok then3')
                .field('parent', 1)
                .attach('file', './jest_test_gif.gif')
                .expect(201)
                .expect('Content-Type', /application\/json/)

        })
    })
})

afterAll(async () => {
    mongoose.connection.close()
})