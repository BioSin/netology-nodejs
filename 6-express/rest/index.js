const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('../db');
router = express.Router();

router.use(bodyParser.json() );
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/users', (req, res) => {
    res.json(db.all());
});

router.get('/users/:id', (req, res) => {
    const { id } = req.params;

    const model = db.find(id);

    if(null === model) {
        return res.status(404).send("User not found");
    }

    res.json(model.attributes);
});

router.post('/users', (req, res) => {
    if(!req.body) {
        return res.sendStatus(400);
    }

    let { name, score } = req.body;

    const model = db.create({name, score});

    res.status(201).json(model.attributes);
});

router.put('/users/:id', (req, res) => {
    if(!req.body) {
        return res.sendStatus(400);
    }

    let { name, score } = req.body;
    let model = db.update(req.params.id, { name, score });

    if(null === model) {
        return res.status(404).send("User not found");
    }

    res.json(model.attributes);
});

router.delete('/users/:id', (req, res) => {
    res.status(200).send(
        db.delete(req.params.id)
            ? 'success'
            : 'failure'
    );
});

exports.restRouter = router;