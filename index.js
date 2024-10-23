const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const notes = require('./routes/notes.routes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.get('/', (req, res) => { res.json({ message: 'OK' }); });

app.use('/notes', notes);

app.listen(port);
