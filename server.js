const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json())

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }

    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    
    database.users.push({
        id: '126',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === req.params.id) { // OR user.id === id (because we destructed const {id} === req.params)
        found = true;    
        return res.json(user);
        } 
    })
    if (!found) {
        res.status(404).json("no such user found");
    }
})

app.post('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === req.body.id) { // NO MORE PARAMS: just body OR user.id === id (because we destructed const {id} === req.body)
        found = true;
        user.entries += 1;    
        return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(404).json("no such user found");
    }
})

// /signin --> POST = success OR fail 
// /register -> POST = user object
// /profile -> ability to access profile of user -> GET /profile/:userId
// /image --> PUT (update on the user profile which already exists, so basically adding photos)

app.listen(3000, () => {
    console.log("Server is starting on port 3000")
});
