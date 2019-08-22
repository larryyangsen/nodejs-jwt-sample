const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const saltRounds = 10;
const secretKey = 'TaiwanNo1';
const users = [
    {
        id: 1,
        name: 'user1',
        password: bcrypt.hashSync('12345', saltRounds),
        posts: [1]
    },
    {
        id: 2,
        name: 'user2',
        password: bcrypt.hashSync('12345', saltRounds),
        posts: [2, 3]
    }
];

const posts = [
    {
        id: 1,
        title: 'Hello , how are you ?',
        author: 'user1',
        time: '2019-08-08T02:19:56.196Z'
    },
    {
        id: 2,
        title: "I'm fine, thank you, and you ?",
        author: 'user2',
        time: '2019-08-08T02:20:06.096Z'
    },
    {
        id: 3,
        title: "How's the weather like ?",
        author: 'user2',
        time: '2019-08-08T02:21:06.996Z'
    }
];

const validateUser = (req, res, next) => {
    try {
        const [, token] = req.get('Authorization').split(' ');
        const user = jwt.verify(token, secretKey);
        req.body.userId = user.id;
        next();
    } catch (e) {
        res.status(404).send(e.message);
    }
};
const getUserPosts = (req, res, next) => {
    try {
        const { userId } = req.body;
        const { posts: userPosts } = users.find(user => user.id === userId);
        req.body.userPosts = posts.filter(
            post => userPosts.indexOf(post.id) !== -1
        );
        next();
    } catch (e) {
        res.status(404).send(e.message);
    }
};

const checkUserPost = (req, res, next) => {
    try {
        const { userPosts } = req.body;
        let { id } = req.params;
        id = parseInt(id);

        if (!userPosts.filter(post => post.id === id).length) {
            res.status(404).send(`${id} is not yours`);
            return;
        }
        const post = posts.find(post => post.id === id);
        req.body.userPost = post;
        next();
    } catch (e) {
        res.status(404).send(e.message);
    }
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Express Running');
});

app.post('/login', (req, res) => {
    const { account, password } = req.body;
    if (!account || !password) {
        res.status(404).json({ message: 'no account or password' });
        return;
    }
    //usually this would be a database call:
    const user = users.find(user => user.name === account);
    if (!user) {
        res.status(401).json({ message: 'no such user found' });
        return;
    }
    if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '12h'
        });
        res.json({ status: 'success', token, userId: user.id });
        return;
    }
    res.status(401).json({ message: 'passwords did not match' });
    return;
});

app.get('/checkLogin', validateUser, (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(404).send('not login');
        return;
    }
    res.status(200).send('ok');
});

app.get('/posts', validateUser, getUserPosts, (req, res) => {
    const { userPosts } = req.body;
    res.json(userPosts);
});

app.get('/posts/:id', validateUser, getUserPosts, checkUserPost, (req, res) => {
    try {
        const { userPost } = req.body;

        res.json(userPost);
    } catch (e) {
        console.log(e);
        res.status(404).send(e.message);
    }
});

app.post('/posts', validateUser, getUserPosts, (req, res) => {
    try {
        const { userPosts, author, title } = req.body;
        const post = {
            id: posts.length,
            author,
            title,
            time: new Date()
        };
        userPosts.push(post.id);
        res.json(post);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

app.put('/posts/:id', validateUser, getUserPosts, checkUserPost, (req, res) => {
    try {
        const { userPost, title } = req.body;
        userPost.title = title;
        const index = posts.findIndex(post => post.id === userPost.id);
        posts[index] = userPost;
        console.log(posts);
        res.json(userPost);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

app.delete(
    '/posts/:id',
    validateUser,
    getUserPosts,
    checkUserPost,
    (req, res) => {
        try {
            const { userPost, userPosts } = req.body;
            const index = posts.findIndex(post => post.id === userPost.id);
            const uIndex = userPosts.findIndex(post => post.id === userPost.id);
            posts.splice(index, 1);
            userPosts.splice(uIndex, 1);
            console.log(posts);
            console.log(userPosts);
            res.json(userPosts);
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

app.listen(3000, err => {
    console.log('listen on ', 3000);
});
