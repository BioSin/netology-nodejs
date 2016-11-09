const fs = require('fs');

const getSubDirectories = (path) => {
    return readDir(path)
        .then(res => filterDirectories(path, res));
};


/**
 * Filter non directory items from the list
 *
 * @param path
 * @param list
 * @returns {Promise.<TResult>}
 */
const filterDirectories = (path, list) => {
    const result = list.map(el => new Promise((resolve, reject) => {
        fs.stat(`${path}/${el}`, (err, stat) => {
            if (null !== err) {
                reject(err);
            }

            if (stat.isDirectory()) {
                resolve(el);
            }
            resolve(null);
        })
    }));

    return Promise.all(result).then(res => {
        return res.filter(el => null !== el)
    });
};

/**
 *
 * Promise wrapper for fs.readdir
 *
 * @param path
 * @returns {Promise}
 */
const readDir = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (null !== err) {
                reject(err);
            }

            resolve(files);
        });
    });
};

module.exports = {
    readDir, filterDirectories, getSubDirectories
};
