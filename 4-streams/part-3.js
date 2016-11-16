const stream = require('stream');

const randomInteger = (min, max) => {
    let rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
};

class Infinity extends stream.Readable {
    _read() {
        this.push(randomInteger(0,99).toString());
    }
}

class Logger extends stream.Writable {
    _write(chunk, encoding, callback) {
        console.log('zz', chunk.toString());
        callback();
    }
}

class Multiplier extends stream.Transform {
    constructor(multiplier = 10, options) {
        super(options);
        this.multiplier = multiplier;
    }

    _transform(chunk, encoding, callback) {
        let result = chunk.toString() * this.multiplier;
        setTimeout(() => {
            callback(null, result.toString());
        }, 1000);

    }
}

const infinity = new Infinity();
const logger = new Logger();
const multiplier = new Multiplier(3);

infinity.pipe(multiplier).pipe(logger);
