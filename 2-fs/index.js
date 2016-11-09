const { hide, seek } = require('./hidenseek');
const action = process.argv[2];

switch (action) {
    case "hide":
        let [,,,path,list] = process.argv;
        hide(path, require(list))
            .then(console.log);
        break;
    case "seek":
        seek(process.argv[3])
            .then(console.log);
        break;
    case "help":
    default:
        console.log(
`Invalid command usage: 
"node index.js hide ./field/ ./pokemons.js" - to hide pokemons
"node index.js seek ./field/" - to seek pokemons in specified directory`);
        break;
}