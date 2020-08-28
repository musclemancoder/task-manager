const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const { response } = require('express')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name:'Rock',
    email:'rocky@example.com',
    password:'MyPass777!',
    tokens:[{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
beforeEach(async ()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup new user',async()=>{
   const response =  await request(app).post('/users').send({
        name:'vishal',
        email:'vishalchowdhary.ce@example.com',
        password:'MyPass777!'
    }).expect(201)
    //Assertion that the database has been changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response

    expect(response.body).toMatchObject({
        user:{
            name:'vishal',
            email:'vishalchowdhary.ce@example.com',
        },
        token : user.tokens[0].token
    })
})

test('Should login the user',async()=>{
  const response =  await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    //Assertion for user token
    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(response.body.token)

})

test('Should not login nonexistent user',async()=>{
    await request(app).post('/users/login').send({
        email:'xx@gmail.com',
        password:userOne.password
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