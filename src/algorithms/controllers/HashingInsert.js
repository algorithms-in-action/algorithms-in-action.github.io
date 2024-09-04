export default {
    initVisualisers() {
        return null;
    },

    run(chunker, params) {
        const SMALL= 11;
        const BIG = 97;
        const BIGPRIME = 3457;
        let mode = 0;
        let incrementType = 0;
        let insertions = 0;
        function hashInit() {
            let tableSize = mode == 0 ? SMALL : BIG;
            let table = new Array(tableSize);

            return table;
        }

        function hash(k) {
            if (mode == 0) {
                return k*BIGPRIME % SMALL;
            }
            return (k*BIGPRIME) % BIG;
        }

        function setIncrement(k) {
            let smallishprime = mode == 0 ? 3 : 23;
            return incrementType == 0 ? 1 : (k*BIGPRIME) % smallishprime;
        }

        function changeMode() {
            mode = mode == 0 ? 1 : 0;
        }

        function changeIncrementType() {
            incrementType = incrementType == 0 ? 1 : 0;
        }

        function hashInsert(table, key) { // add mode parameter with case for
            insertions = insertions + 1;
            // get initial hash index
            let i = hash(key);

            let increment = setIncrement(key);
            // linear probing collision handling
            while (typeof table[i] !== 'undefined' && table[i] !== null) {
                i = (i + increment) % table.length;

            }
            table[i] = key;

        }

        function hashDelete(table, key) {
            insertions = insertions - 1;
            let i = hash(key);
            let increment = setIncrement(key);
            while (table[i] != key) {
                i = (i + increment) % table.length;
            }
            table[i] = null;
        }
    },
};
