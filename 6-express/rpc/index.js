const express = require('express');
const bodyParser = require('body-parser');
const {db} = require('../db');
router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// Validate RPC request
router.use((req, res, next) => {
    if (!req.body['jsonrpc'] || req.body['jsonrpc'] !== '2.0' || !req.body['method']) {
        res.json(responseHelper.error(req.body['id'], -32700, 'Invalid json format'));
    } else {
        next();
    }
}, (req, res, next) => {
    if (!req.body['id']) {
        res.json(responseHelper.error(null, -32600, 'Notification requests is not supported by this server, add ID to your request.'))
    } else {
        next();
    }
}, (req, res, next) => {
    if (!RPC[req.body['method']]) {
        res.json(responseHelper.error(res.body['id'], -32601, 'The method does not exist / is not available.'));
    } else {
        next();
    }
});

const RPC = {
    all(params, callback) {
        callback(null, db.all());
    },

    get(params, callback) {
        const { id } = params;

        if(!id) {
            return callback('ID is not provided');
        }

        const model = db.find(id);

        if(null === model) {
            return callback('Model not found');
        }

        callback(null, model.attributes);
    },

    post(params, callback) {
        if(!params) {
            return callback("Invalid params");
        }

        let { name, score } = params;

        const model = db.create({name, score});

        callback(null, model.attributes);
    },

    put(params, callback) {
        if(!params || !params['id']) {
            callback("Invalid params");
        }

        let { id, name, score } = params;
        let model = db.update(id, { name, score });

        if(null === model) {
            return callback("User not found");
        }

        callback(null, model.attributes);
    },

    delete(params, callback) {
        const { id } = params;

        if(!id) {
            return callback("ID is not provided");
        }

        db.delete(id)
            ? callback(null, 'success')
            : callback('User not deleted');
    }
};

const responseHelper = {
    success(id, result) {
        return {jsonrpc: '2.0', result, id};
    },
    error(id, code, message, data) {
        return {jsonrpc: '2.0', error: {code, message, data}, id};
    }
};

router.post('/', function (req, res) {
    const method = RPC[req.body['method']];
    const id = req.body['id'];

    method(req.body['params'], (err, result) => {
        if (err) {
            return res.json(responseHelper.error(id, 500, err))
        }

        res.send(responseHelper.success(id, result));
    })
});

exports.rpcRouter = router;
