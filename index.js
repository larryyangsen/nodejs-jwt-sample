const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

//fake datas//////
const users = [
    {
        id: 1,
        name: 'user1',
        password: '%2yx4'
    },
    {
        id: 2,
        name: 'test',
        password: 'test'
    }
];
//////////////
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: 'taiwanNo1'
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    //usually this would be a database call:
    const user = users[_.findIndex(users, { id: jwt_payload.id })];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

//parse application/x-www-form-urlencoded
//for easier testing with Postman or plain HTML forms

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

//parse application/json

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: 'Express is up!' });
});

app.post('/login', (req, res) => {
    const { account, password } = req.body;
    if (!account || !password) {
        res.status(404).json({ message: 'no account or password' });
        return;
    }
    //usually this would be a database call:
    const user = users[_.findIndex(users, { name: account })];
    if (!user) {
        res.status(401).json({ message: 'no such user found' });
        return;
    }
    if (user.password === req.body.password) {
        //from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        const payload = { id: user.id };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: 'ok', token: token });
    } else {
        res.status(401).json({ message: 'passwords did not match' });
        return;
    }
});

app.get(
    '/secret',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        console.log(req.get('Authorization'));
        res.json('Success! You can not see this without a token');
    }
);

app.listen(3000, () => {
    console.log('ready');
});
