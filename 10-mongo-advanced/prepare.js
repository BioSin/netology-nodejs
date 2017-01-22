const config = require('./config.json');
const faker = require('faker');
const mongo = require('mongodb').MongoClient;

faker.locale = 'ru';
const initialData = [];
for(let i = 0; i < 5; i++) {
    initialData.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        mobile: faker.phone.phoneNumberFormat(),
        email: faker.internet.email()
    })
}

mongo.connect(config.mongo.dsn)
    .then(db => db.collection(config.mongo.collection))
    .then(cl => cl.insertMany(initialData))
    .then(res => console.log(`Inserted ${res.insertedIds.length} rows!`))
    .catch(err => console.log(err));