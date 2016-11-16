const crypto = require('crypto');
const Transform = require('stream').Transform;

class Hasher extends Transform {
    constructor(algo, options) {
        super(options);
        this.hash = crypto.createHash(algo);
    }

    _transform(chunk, encoding, callback) {
        this.hash.update(chunk);
        callback();
    }

    _flush(callback) {
        this.push(this.hash.digest('hex'));
        callback();
    }
}

exports.Hasher = Hasher;