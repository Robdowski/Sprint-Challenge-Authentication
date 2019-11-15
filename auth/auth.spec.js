const db = require('../database/dbConfig')
const Users = require('./users-model')
const request = require('supertest')
const server = require('../api/server')

describe('register / login', () =>{

    beforeEach(async() => {
        await db('users')
            .truncate();
    })

    // REGISTER
    it('should register an account', async() =>{
        const register = await request(server).post('/api/auth/register')
        .send({ username: 'robert', password: 'carter' })

        const users = await db('users')

        expect(users[0]).toBeDefined()
    })

    it('should register the correct username to the account', async() =>{
        const register = await request(server).post('/api/auth/register')
        .send({ username: 'robert', password: 'carter' })

        const users = await db('users')
        expect(users[0].username).toMatch(/robert/i)
    })


     //LOGIN
    it('should return 200 ok on login', async () => {    
        const register = await request(server).post('/api/auth/register')
        .send({ username: 'robert', password: 'carter' })

        
        const login = await request(server).post('/api/auth/login')
            .send({ username: 'robert', password: 'carter' })
            expect(login.status).toBe(200)
    })

    it('should return a token on login', async() =>{
        const register = await request(server).post('/api/auth/register')
        .send({ username: 'robert', password: 'carter' })

        
        const login = await request(server).post('/api/auth/login')
            .send({ username: 'robert', password: 'carter' })
            expect(login.body.token).toBeDefined()
    })

    // GET JOKES

    it('should return 400 if not logged in', async() =>{
        const get = await request(server).get('/api/jokes')

        expect(get.status).toBe(400)
    })

    it('should return 200 if logged in', async() => {
        const register = await request(server).post('/api/auth/register')
        .send({ username: 'robert', password: 'carter' })

        
        const login = await request(server).post('/api/auth/login')
        .send({ username: 'robert', password: 'carter' })
        
        const token = login.body.token
        console.log(token)
        const get = await request(server).get('/api/jokes').set('authorization', token)

        expect(get.status).toBe(200)
    })
})