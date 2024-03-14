const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
    {
      name: "ALEJANDRO",
      username: "ALE",
      passwordHash: "unkjnjknkjnk",
    },
    {
        name: "Migule",
        username: "MM",
        passwordHash: "jsahjdZkjnwkq",
      }
  ]

  describe('when there is initially some users saved', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      let userObject = new User(initialUsers[0])
      await userObject.save()
  
      userObject = new User(initialUsers[1])
      await userObject.save()
    })
  
    test('creation fails with proper status code and message if username already taken', async () => {
      const usersAtStart = await User.find({})
  
      const newUser = {
        username: 'ALE',
        name: 'Test Name',
        password: 'password123',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(409)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('Username is already in use')
  
      const usersAtEnd = await User.find({})
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  
    test('creation fails with proper status code and message if username or password is less than 3 characters', async () => {
      const newUser = {
        username: 'MM',
        name: 'Test Name',
        password: 'password123',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('Username and password must be at least 3 characters long')
    })
  })
  