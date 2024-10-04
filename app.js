const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});


app.listen(port);