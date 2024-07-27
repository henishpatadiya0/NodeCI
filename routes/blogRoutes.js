const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
// const redis = require('redis');
// const redisURL = 'redis://127.0.0.1:6379';
// const client = redis.createClient(redisURL);

// const util = require('util');
// client.get = util.promisify(client.get);

const clearCache = require('../middlewares/clearCache');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, clearCache, async (req, res) => {
    // Do we have any data related to this query in redis
    // const cachedBlogs = await client.get(req.user.id);
    // if (cachedBlogs) {
    //   console.log('--- From redis ---')
    //   return res.send(JSON.parse(cachedBlogs));
    // }

    const blogs = await Blog.find({ _user: req.user.id }).cache({ key: req.user.id });
    // console.log('--- From mongodb ---');
    res.send(blogs);

    // client.set(req.user.id, JSON.stringify(blogs))
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }

    // clearHash(req.user.id);
  });
};
