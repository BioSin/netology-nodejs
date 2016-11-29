const express = require('express');
const app = express();

const { restRouter } = require('./rest');
const { rpcRouter } = require('./rpc');

const PORT = process.env.PORT || 3000;

app.use('/rest', restRouter);
app.use('/rpc', rpcRouter);

app.get('/', (req, res) => {
    res.json({ message: 'User /rpc or /rest endpoints' });
});

app.listen(PORT);