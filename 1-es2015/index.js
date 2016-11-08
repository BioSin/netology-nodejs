class Pokemon {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    /**
     * Output pokemon info
     */
    show() {
        console.log(`Pokemon ${this.name}, ${this.level}lvl`);
    }

    /**
     * Returns pokemon's level
     */
    valueOf() {
        return this.level;
    }
}

class PokemonList extends Array {
    /**
     * Add Pokemon to list
     */
    add(name, level) {
        this.push(new Pokemon(name, level));
    }

    /**
     * Return pokemon with biggest level
     */
    max() {
        return this.reduce((previous, current) => {
            return current >= previous
                ? current
                : previous;
        });
    }

    /**
     * Output info for all pokemons in the list
     */
    show() {
        this.forEach(el => el.show())
        console.log(`Pokemon count: ${this.length}`);
    }
}


console.log('Creating lists....');
const lost = new PokemonList(new Pokemon('Pikachu', 2));
const found = new PokemonList(
    new Pokemon('Bulbasaur', 1),
    new Pokemon('Venusaur', 3)
);

lost.add('Charmander', 1);
lost.add('Charmeleon', 2);
found.add('Charizard', 3);

lost.show();
found.show();

console.log('Transfering pokemon....');
let transferIdx = 2;
let transferPokemon = found[transferIdx];
found.splice(transferIdx, 1);
lost.add(transferPokemon.name, transferPokemon.level);

lost.show();
found.show();

console.log('Searching pokemon with max level...');
found.max().show();
lost.max().show();
