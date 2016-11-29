const express = require('express');
const bodyParser = require('body-parser');
const {db} = require('../db');
router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Prepare fields
 * @param req
 * @param res
 * @param next
 */
const fieldsMiddleware = (req, res, next) => {
    let fields = req.query['fields'] || '';
    req.fields = fields.split(',');
    next();
};

/**
 * Extract necessary fields from object
 * @param el
 * @param fields
 * @returns {{}}
 */
const extractFields = (el, fields) => {
    let result = {};
    fields.forEach((field) => {
        result[field] = el[field] || undefined;
    });

    return result;
};

router.route('/users')
    .get(fieldsMiddleware, (req, res) => {
        let data = db.all({
            limit: req.query.limit,
            offset: req.query.offset
        });

        if(req.fields.length) {
            data = data.map(el => extractFields(el, req.fields));
        }

        res.json(data);
    })
    .post((req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }

        let {name, score} = req.body;

        const model = db.create({name, score});

        res.status(201).json(model.attributes);
    });


router.route('/users/:id')
    .get(fieldsMiddleware, (req, res) => {
        const {id} = req.params;

        const model = db.find(id);

        if (null === model) {
            return res.status(404).send("User not found");
        }

        let data = model.attributes;

        if(req.fields.length) {
            data = extractFields(data, req.fields);
        }

        res.json(data);
    })
    .put((req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }

        let {name, score} = req.body;
        let model = db.update(req.params.id, {name, score});

        if (null === model) {
            return res.status(404).send("User not found");
        }

        res.json(model.attributes);
    })
    .delete((req, res) => {
        res.status(200).send(
            db.delete(req.params.id)
                ? 'success'
                : 'failure'
        );
    });

router.delete('/delete-users', (req, res) => {
    res.status(200).send(db.deleteAll());
});

router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send({error: err.stack});
});

exports.restRouter = router;