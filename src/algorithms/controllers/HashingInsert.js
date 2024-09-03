export default {
    initVisualisers() {
        return null;
    },

    run(chunker, params) {
        const SMALL= 11;
        const BIG = 97;
        let mode = 0;
        function hashInit() {
            let tableSize = mode == 0 ? SMALL : BIG;
            let table = new Array(tableSize);

            return table;
        }

        function hash(k) {
                return mode == 0 ? k % SMALL : k % BIG;
        }

        function hashInsert(table, key) { // add mode parameter with case for

            // get initial hash index
            let i = hash(key);

            // linear probing collision handling
            while (typeof table[i] !== 'undefined' && table[i] !== null) {
                i = i + 1;
                if (i > 10) {
                    i = 0;
                }
            }
            table[i] = key;
        }

        function hashDelete(table, key) {
            let i = hash(key);

            while (table[i] != key) {
                i = i + 1;
                if (i > 10) {
                    i = 0;
                }
            }
            table[i] = null;
        }
    },
};
