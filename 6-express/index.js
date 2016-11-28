const express = require('express');
const app = express();

const { restRouter } = require('./rest');

const PORT = process.env.PORT || 3000;

app.use('/rest', restRouter);

app.get('/', (req, res) => {

});

app.listen(PORT);