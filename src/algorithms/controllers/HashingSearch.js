export default {
    initVisualisers() {
    },

    run(chunker, params) {
    // small hash, table size 11
        const hash1 = (key) => {
            return key % 11;
        }

        const hashSearch = (table, k) => {
            // index
            let i = hash1(k);

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
