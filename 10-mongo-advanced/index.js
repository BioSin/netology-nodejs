"use strict";
const config = require('./config.json');
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');

const restRouter = express.Router();
restRouter.use(bodyParser.json());
restRouter.use(bodyParser.urlencoded({extended: true}));

class Contact {
    constructor(obj) {
        Object.assign(this, obj);
    }

    get attributes() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            mobile: this.mobile
        };
    }

    validate() {
        if (_.isNil(this.first_name)
            || _.isNil(this.last_name)
            || _.isNil(this.email)
            || _.isNil(this.mobile)) {
            return false;
        }

        return true;
    }
}

class RestApi {
    _collection() {
        return mongo.connect(this.config.mongo.dsn)
            .then(db => db.collection(this.config.mongo.collection));
    }

    constructor(config) {
        this.config = config;
    }

    index(req, res) {
        this._collection()
            .then(c => c.find().toArray())
            .then(r => res.send(r))
            .catch(err => res.status(500).send(err));
    }

    post(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        let model = new Contact(req.body);
        if (!model.validate()) {
            return res.status(422)
                .send({ok: false, message: "Invalid data"});
        }

        this._collection()
            .then(c => c.insertOne(model))
            .then(r => res.send(r))
            .catch(err => res.status(500).send(err));
    }

    get(req, res) {
        this._collection()
            .then(c => c.find({_id: ObjectId(req.params.id)}).toArray())
            .then(r => res.send(r))
            .catch(err => res.status(500).send(err));
    }

    delete(req, res) {
        this._collection()
            .then(c => c.remove({_id: ObjectId(req.params.id)}))
            .then(r => res.json(r));
    }

    update(req, res) {
        const {id} = req.params;

        let data = req.body;
        delete(data['_id']);

        this._collection()
            .then(c => c.updateOne({"_id": ObjectId(id)}, {$set: data}))
            .then(r => res.status(200).send(r))
            .catch(err => res.status(500).send(err));
    }

    search(req, res) {
        this._collection()
            .then(collection => {
            let filter = [];

            if (req.body.phone) {
                filter.push({phone: {$regex: req.body.phone}});
            }
            if (req.body.first_name) {
                filter.push({first_name: {$regex: req.body.first_name}});
            }
            if (req.body.last_name) {
                filter.push({last_name: {$regex: req.body.last_name}});
            }

            let search = {};
            if (filter.length > 0) {
                search = {$or: filter};
            }
            return collection.find(search).toArray();
        })
            .then(data => res.send(data))
            .catch(err => res.status(500).send(err.toString));
    }
}

const api = new RestApi(config);

restRouter.route('/contacts')
    .get(api.index.bind(api)) // Получение списка
    .post(api.post.bind(api)); // Создание новой модели

restRouter.route('/contacts/search')
    .post(api.search.bind(api)); // Поиск

restRouter.route('/contacts/:id')
    .get(api.get.bind(api)) // Модель по ИД
    .put(api.update.bind(api)) // Обновление модели
    .delete(api.delete.bind(api)); // Удаление модели

app.use('/', restRouter);
app.get('/', (req, res) => res.json({message: 'Use /rest/contacts endpoint'}));
app.listen(config.express.port || 3000);