const fs = require('fs');
const fsHelper = require('./fs-helpers');
const Pokemon = require('./pokemon');
const PokemonList = require('./pokemon-list');

/**
 *
 * @param path
 * @returns {Promise.<TResult>}
 */
const seek = (path) => {
    return fsHelper.getSubDirectories(path)
        .then(directories => {

            let all = directories.map(dirPath => {
                let fullPath = `${path}/${dirPath}/pokemon.txt`;
                return new Promise((resolve, reject) => {
                    fs.readFile(fullPath, 'utf8', (err, data) => {
                        if (err) {
                            if (err.code === "ENOENT") {
                                resolve(null);
                            }

                            reject(err);
                        } else {
                            resolve(new Pokemon(...data.split('|')))
                        }
                    });
                });

            });

            return Promise.all(all);
        })
        .then(result => result.filter(el => null !== el))
        .then(list => new PokemonList(...list))
};

/**
 *
 * @param path
 * @param list
 * @returns {Promise.<TResult>}
 */
const hide = (path, list) => {
    const pokemonList = new PokemonList(...selectPokemons(list));

    return prepareDirectories(path)
        .then(directories => {
            let selectedDirectories = shuffle(directories)
                .slice(0, pokemonList.length);

            let all = pokemonList.map((pokemon, idx) => {
                return new Promise((resolve, reject) => {
                    fs.writeFile(
                        `${selectedDirectories[idx]}/pokemon.txt`,
                        `${pokemon.name}|${pokemon.level}`,
                        (err) => err !== null ? reject(err) : resolve(pokemon)
                    );
                })
            });

            return Promise.all(all);
        })
        .then(() => pokemonList);
};

/**
 * Returns 3 random items from original list
 *
 * @param list
 * @param count
 * @returns {ArrayBuffer|Blob|Array.<T>|Buffer|string}
 */
const selectPokemons = (list, count = 3) => {
    return shuffle(list.slice()).slice(
        0,
        (list.length >= count ? count : list.length)
    );
};

/**
 * Preparing directories
 * @param path
 * @returns {Promise.<*>}
 */
const prepareDirectories = (path) => {
    const dirNames = range(1, 10).map(el => {
        let pad = "00";
        el = "" + el;
        return pad.substring(0, pad.length - el.length) + el;
    });

    let all = dirNames.map(dirName => {
        let fullPath = `${path}/${dirName}`;

        return new Promise((resolve, reject) => {
            fs.mkdir(fullPath, err => {
                if (err && err.code !== "EEXIST") {
                    reject(err);
                }

                resolve(fullPath);
            });

        });
    });

    return Promise.all(all);
};

/**
 * Return array with integer values from specified range
 *
 * @param start
 * @param end
 */
const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

/**
 * Fisher-Yates Shuffle algorithm implementation
 * @see https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
 * @param array
 * @returns {*}
 */
const shuffle = (array) => {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

module.exports = {
    hide,
    seek
};