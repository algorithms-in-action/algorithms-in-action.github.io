export default {
    initVisualisers() {
    },

    run(chunker, params) {
    // small hash, table size 11
        const SMALL= 11;
        const BIG = 97;
        let mode = 0

        function hash(k) {
                        return mode == 0 ? k % SMALL : k % BIG;
        }

        function hashSearch(table, k) {
            // index
            let i = hash(k);

            while (table[i] != k) {
                i = i+1;
                if (i > 10) {
                   i = 0;
                }
            }
            return i;
        }
    },
};
