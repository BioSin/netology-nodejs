const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 3000;

class Product {
    constructor(id, name, count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }

    toString() {
        return {
            id: this.id,
            name: this.name,
            count: this.count
        }
    }
}

class Warehouse {
    constructor(products = []) {
        this.products = products;
    }

    add(productId, count) {
        let product = this.products[productId - 1];

        if(!product) {
            return false;
        }

        product.count = parseInt(product.count) + parseInt(count);
        return product;
    }

    deleteProduct(productId, count) {
        let product = this.products[productId - 1];

        if(!product) {
            return false;
        }

        product.count = parseInt(product.count) - parseInt(count);
        return product;
    }

    register(name, count) {
        let product = new Product(this._generateId(), name, count);
        this.products.push(product);

        return product;
    }

    leftOver() {
        return this.products
            .map(el => el.toString());
    }

    _generateId() {
        return this.products.length + 1;
    }
}

class Api {
    static register(wh, name, count) {
        let product = wh.register(name, count);

        if(!product) {
            return {data: 'Invalid data', code: 400};
        }

        return {
            data: product.toString(),
            code: 200
        };
    }

    static add(wh, id, count) {
        let product = wh.add(id, count);

        if(!product) {
            return {data: 'Invalid data', code: 400};
        }

        return {
            data: product.toString(),
            code: 200
        };
    }

    static deleteProduct(wh, id, count) {
        let product = wh.deleteProduct(id, count);

        if(!product) {
            return {data: 'Invalid data', code: 400};
        }

        return {
            data: product.toString(),
            code: 200
        };
    }

    static leftOver(wh) {
        return {
            data: wh.leftOver(),
            code: 200
        }
    }
}

const store = new Warehouse();

const validateParams = (data, params) => {
    let valid = true;
    params.forEach(el => {
        valid = !!data[el] || false;
    });

    return valid;
};

const handler = (req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    let response;

    switch(pathname) {
        case '/register':
            response = Api.register(store, query.name, query.count);
            break;
        case '/add':
            response = Api.add(store, query.id, query.count);
            break;
        case '/delete':
            response = Api.deleteProduct(store, query.id, query.count);
            break;
        case '/left-over':
            response = Api.leftOver(store);
            break;
        default:
            break;
    }

    res.writeHead(response.code, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(response.data));
};

http
    .createServer()
    .on('request', handler)
    .on('error', console.log)
    .listen(PORT);