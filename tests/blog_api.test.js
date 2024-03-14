const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: "el mejor blog",
    author: "ALejandro Magno",
    url: "blog.com",
    likes: 2
  },
  {
    title: "un blog",
    author: "Julio cesar",
    url: "x.com",
    likes: 10
  },
]

const initialUsers = [
  {
    "username": "felipe",
    "name": "felipe",
    "password": "felipe"
  }
]
beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

  const token_response = await api
  .post('/api/users')
  .send({
    username: "felipe",
    name: "felipe",
    password: "felipe"
  })


  
  console.log(token_response.body)
  


})

test('blogs are returned as json', async () => {
  
    api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all blogs are returned', async () => {
  
  const response = await api.get('/api/blogs');
  
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(initialBlogs.length);


  })
  
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
  
  
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
      'un blog'
    )
  })

  test('blog posts have an `id` property', async () => {
    const response = await api.get('/api/blogs');
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
  });
  
  test('a new blog post can be created', async () => {
    const newBlog = {
      title: 'Un nuevo blog',
      author: 'Autor del blog',
      url: 'nuevoblog.com',
      likes: 0,
    };

    const token_response = await api
    .post('/api/login')
    .send({
      username: "felipe",
      password: "felipe"
    })

  
    const response = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token_response.body.token}` })
      .send(newBlog)
      
    const blogsAtEnd = await api.get('/api/blogs');
  
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1);
    expect(response.body.title).toBe(newBlog.title);
  });

  test('if property likes is not defined likes equal to zero', async () => {
    const newBlog = {
      title: 'Un nuevo blog',
      author: 'Autor del blog',
      url: 'nuevoblog.com'
    };

    const token_response = await api
    .post('/api/login')
    .send({
      username: "felipe",
      password: "felipe"
    })
    
    console.log(token_response.body.token)
  
    const response = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token_response.body.token}` })
      .send(newBlog)
      
    
  
    expect(response._body.likes).toBe(0);
  });

  test('returns a 400 error if title or url is missing', async () => {  
    
      
    const newBlogWithoutTitle = {
      author: 'Autor del blog',
      url: 'nuevoblog.com',
    };

    const token_response = await api
    .post('/api/login')
    .send({
      username: "felipe",
      password: "felipe"
    })
    const responseWithoutTitle = await api.post('/api/blogs').send(newBlogWithoutTitle).set({ Authorization: `Bearer ${token_response.body.token}` });
    expect(responseWithoutTitle.status).toBe(400);
    expect(responseWithoutTitle.body.error).toBe('Title and url are required');
  
    const newBlogWithoutUrl = {
      title: 'Un nuevo blog',
      author: 'Autor del blog',
    };
  
    const responseWithoutUrl = await api.post('/api/blogs').send(newBlogWithoutUrl).set({ Authorization: `Bearer ${token_response.body.token}` });
    expect(responseWithoutUrl.status).toBe(400);
    expect(responseWithoutUrl.body.error).toBe('Title and url are required');
  });
  
    
afterAll(() => {
  mongoose.connection.close()
})

test('blog post fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Un nuevo blog',
    author: 'Autor del blog',
    url: 'nuevoblog.com',
    likes: 0,
  };

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  expect(result.body.error).toContain('token missing')
});
