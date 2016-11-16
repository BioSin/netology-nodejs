const fs = require('fs');
const { Hasher } = require('./hasher');

const input = fs.createReadStream('./source.txt');
const output = fs.createWriteStream('./part-2.txt.md5');

const hasher = new Hasher('md5');

input.pipe(hasher).pipe(output);
input.pipe(hasher).pipe(process.stdout);
