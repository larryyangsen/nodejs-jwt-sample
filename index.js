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
        posts: [
            {
                id: 1,
                title: 'Hello , how are you ?',
                author: 'Ark',
                time: '2019-08-08T02:19:56.196Z'
            },
            {
                id: 2,
                title: "I'm fine, thank you, and you ?",
                author: 'Bibby',
                time: '2019-08-08T02:20:06.096Z'
            },
            {
                id: 3,
                title: "How's the weather like ?",
                author: 'C.C',
                time: '2019-08-08T02:21:06.996Z'
            }
        ]
    },
    {
        id: 2,
        name: 'user2',
        password: bcrypt.hashSync('12345', saltRounds),
        posts: [
            {
                id: 1,
                title: 'Hello , how are you ?',
                author: 'Ark',
                time: '2019-08-08T02:19:56.196Z'
            },
            {
                id: 2,
                title: "I'm fine, thank you, and you ?",
                author: 'Bibby',
                time: '2019-08-08T02:20:06.096Z'
            },
            {
                id: 3,
                title: "How's the weather like ?",
                author: 'C.C',
                time: '2019-08-08T02:21:06.996Z'
            }
        ]
    }
];

const validateUser = (req, res, next) => {
    try {
        const [, token] = req.get('Authorization').split(' ');
        console.log(token);

        const user = jwt.verify(token, secretKey);
        console.log(user);
        req.body.userId = user.id;
        next();
    } catch (e) {
        res.status(404).send(e.message);
    }
};
const getUserPosts = (req, res, next) => {
    try {
        const { userId } = req.body;
        const { posts } = users.find(user => user.id === userId);
        req.body.posts = posts;
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

app.get('/posts', validateUser, getUserPosts, (req, res) => {
    const { posts } = req.body;
    res.json(posts);
});

app.post('/posts', validateUser, getUserPosts, (req, res) => {
    try {
        const { posts, author, title } = req.body;
        const post = {
            id: posts.length,
            author,
            title,
            time: new Date()
        };
        posts.push(post);
        res.json(post);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

app.listen(3000, err => {
    console.log('listen on ', 3000);
});
