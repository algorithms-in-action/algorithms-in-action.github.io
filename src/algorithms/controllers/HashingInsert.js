export default {
    initVisualisers() {
        return null;
    },

    run(chunker, params) {

        function hashInit(tableSize) {
            let table = new Array(tableSize);

            return table;
        }

        function hash1(k) {
            return k % 11;
        }

        function hashInsert(table, key) { // add mode parameter with case for

            // get initial hash index
            let i = hash1(key);

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
            let i = hash1(key);

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
