const client = require('mongodb').MongoClient;
const config = require('./config.json');

const dummyData = [
    {
        name: 'Valentine',
        age: 27,
        position: 'CEO',
        department: 'Management'
    },
    {
        name: 'Alex',
        age: 33,
        position: 'CTO',
        department: 'Management'
    },
    {
        name: 'Yan',
        age: 28,
        position: 'Developer',
        department: 'It'
    },
    {
        name: 'Yaroslav',
        position: 'Junior Developer',
        department: 'It'
    }
];

client.connect(config.mongo.dsn, (err, db) => {
    if(err) {
        throw new Error(err);
    }

    const collection = db.collection('company');

    collection.insertMany(dummyData).then((r) => {
        if(err) {
            throw new Error(err);
        }

        collection.find().toArray().then((r) => {
            if (err) {
                throw new Error(err);
            }

            console.log(`Найдено ${r.length} записей`);
        });

        collection.find({ age: null }).toArray().then((r) => {
            if (err) {
                throw new Error(err);
            }

            console.log(`Сотрудников без указанного возраста ${r.length}`);
            console.log(r);
        });

        collection.find({ department: 'It', position: 'Developer' }).toArray().then((r) => {
            if (err) {
                throw new Error(err);
            }

            console.log(`Количество миддлов в IT отделе: ${r.length}`);
            console.log(r);
        });


        collection.updateMany({department: "Management"}, {$set: {department: 'Central department', priority: 1}}).then(result => {
            console.log(`Переведено из отдела управления: ${result.modifiedCount}`);
        });

        collection.deleteMany({position: "Developer"}).then(result => {
            console.log(`Удалено миддлов в IT департаменте: ${result.deletedCount}`);
        });

        collection.removeMany().then(result => {
            console.log(`Удалены все: ${result.deletedCount}`);
        });

    })
});
