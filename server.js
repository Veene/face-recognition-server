const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'legolas1',
      database : 'postgres'
    }
  });

db.select('*').from('users').then(data => { //when server starts, all users in db are console logged.
    console.log(data);
});

const app = express();
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data=> {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        console.log(isValid);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                console.log(user);
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'))
            
        } else {
            res.status(400).json('Wrong credentials');
        }
    }).catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users') //instead of using db, use trx now because this is the way to link both tables
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    
        .catch(err => {res.status(400).json('Unable to register')})
   
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id:id}).then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('Not Found')
        }
    })
    .catch(err => res.status(400).json('error getting user '))

})

app.put('/image', (req,res) => {
    const { id } = req.body; //not super important to have
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]); 
    })
    .catch(err => res.status(400).json('Unable to get entries'))
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

// /signin --> POST = success OR fail 
// /register -> POST = user object
// /profile -> ability to access profile of user -> GET /profile/:userId
// /image --> PUT (update on the user profile which already exists, so basically adding photos)

app.listen(3000, () => {
    console.log("Server is starting on port 3000")
});
