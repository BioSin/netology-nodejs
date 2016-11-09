module.exports = class PokemonList extends Array {
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
};
