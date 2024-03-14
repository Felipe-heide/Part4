const usersRouter = require('express').Router()
const User = require('../models/user')
const loginRouter = require('express').Router()

require('express-async-errors')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
  const users = await User.find()
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password || !name) {
        return response.status(400).json({ error: 'Username, password, and name are required' });
      }
    
      if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
      }
    
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return response.status(409).json({ error: 'Username is already in use' });
      }
    


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log(passwordHash)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)

})

usersRouter.delete('/:id', async (request, response) => {
  const deletedUser = await User.findByIdAndDelete(request.params.id)
  response.json(deletedUser)
  response.status(204).end()
})

usersRouter.put('/:id', async (request, response) => {
  const body = request.body
  const update = {
    username: body.username,
    password: body.password,
    name: body.name
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, update, { new: true })
  response.json(updatedUser)
})

module.exports = usersRouter

