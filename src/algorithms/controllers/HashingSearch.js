export default {
    initVisualisers() {
    },

    run(chunker, params) {
    // small hash, table size 11
        const SMALL= 11;
        const BIG = 97;
        const BIGPRIME = 3457;
        let mode = 0;
        let incrementType = 0;

        function hash(k) {
                        return mode == 0 ? k % SMALL : k % BIG;
        }

        function setIncrement(k) {
            let smallishprime = mode == 0 ? 3 : 23;
            return incrementType == 0 ? 1 : (k*BIGPRIME) % smallishprime;
        }

        function hashSearch(table, key) {
            // index
            let i = hash(key);
            let increment = setIncrement(key);
            while (table[i] != key) {
                i = (i + increment) % table.length;
            }
            return i;
        }
    },
};
