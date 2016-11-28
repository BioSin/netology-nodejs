class User {
    constructor(params) {
        this.attributes = params;
    }

    set attributes(params) {
        Object.assign(this, params);
    }

    get attributes() {
        return {
            id: this.id,
            name: this.name,
            score: this.score
        };
    }
}

class UserDb {
    constructor(users = []) {
        this.users = new Map(
            users
                .filter(el => el.id)
                .map(el => [parseInt(el.id), el])
        );
    }

    all() {
        return Array.from(this.users
            .values())
            .map(el => el.attributes);
    }

    create(params) {
        params['id'] = this._generateId();
        const model = new User(params);

        this.users.set(model.id, model);

        return model;
    }

    update(id, params) {
        id = parseInt(id);
        const model = this.users.get(id);

        if(undefined === model) {
            return null;
        }

        model.attributes = params;

        return model;
    }

    find(id) {
        id = parseInt(id);
        return this.users.get(id);
    }

    delete(id) {
        id = parseInt(id);
        return this.users.delete(id);
    }

    _generateId() {
        return this.users.size + 1;
    }
}

const db = new UserDb([
    new User({name: 'Alex', score: 12, id: 1}),
    new User({name: 'Ben', score: 6, id: 2}),
    new User({name: 'Mike', score: 2, id: 3}),
]);

exports.db = db;
