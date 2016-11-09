module.exports = class Pokemon {
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
};
