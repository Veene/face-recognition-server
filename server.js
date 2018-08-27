const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.get('/', (req, res) => {
    res.send('this is working');
})

app.listen(3000, () => {
    console.log("Server is starting on port 3000")
});
