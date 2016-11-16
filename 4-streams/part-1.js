const fs = require('fs');
const crypto = require('crypto');

const input = fs.createReadStream('./source.txt');
const output = fs.createWriteStream('./part-1.txt.md5');

const hash = crypto.createHash('md5');
hash.setEncoding('hex');

input.pipe(hash).pipe(output);
input.pipe(hash).pipe(process.stdout);