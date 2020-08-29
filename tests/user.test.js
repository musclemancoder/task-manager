const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Vishal',
        email: 'vishal@example.com',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Vishal',
            email: 'vishal@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
})

test('Should login the user',async()=>{
  const response =  await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    //Assertion for user token
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('should read profile', async () => {
    await request(app)
    .get('/users/mee')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should NOT read profile', async () => {
    await request(app)
    .get('/users/mee')
    .send()
    .expect(401)
})

test('should delete profile', async () => {
  const response =  await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete profile', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('upload profile pic', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)

    //Assertion for pic in Db
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update a User', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'Viky'
    })
    .expect(200)

    //Assertion for pic in Db
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Viky')
})