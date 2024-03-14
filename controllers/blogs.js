const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors'); 


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }


  const user = await User.findById(decodedToken.id)

  console.log(user)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and url are required' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user, 
    date: new Date(),
  });

  const savedBlog = await blog.save();
  console.log(savedBlog)
  user.blogs = user.blogs.concat({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0

  });
  await user.save();

  response.json(savedBlog);
});


blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: 'Unauthorized: Missing access token' });
  }


  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    const blogId = request.params.id;

    const blogToDelete = Blog.findById(blogId)
    const user = request.user

  

    if (!blogToDelete || !user) {
      return response.status(403).json({ error: 'Forbidden: Blog not found or unauthorized deletion' });
    }

    if (blogToDelete.user._id.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'Forbidden: You are not authorized to delete this blog' });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    response.status(204).end(); 
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' }); 
  }
});


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const update = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

    const updatedBlog = await Blog.findByIdAndUpdate( request.params.id, update, { new: true } );
    response.json(updatedBlog);
 
});

module.exports = blogsRouter;
