// Simple test to verify merge sort logic without animation
// This simulates the algorithm without chunker

function testMergeSort() {
    console.log("=== Testing Merge Sort Logic ===\n");

    // Test case 1: Normal unsorted array
    testCase([5, 3, 8, 1], "Normal unsorted");

    // Test case 2: Already sorted
    testCase([1, 3, 5, 8], "Already sorted");

    // Test case 3: Reverse sorted
    testCase([8, 5, 3, 1], "Reverse sorted");

    // Test case 4: Single element
    testCase([5], "Single element");

    // Test case 5: Two elements
    testCase([8, 3], "Two elements");

    // Test case 6: Duplicates
    testCase([5, 3, 5, 1, 3], "With duplicates");
}

function testCase(input, description) {
    console.log(`\n--- Test: ${description} ---`);
    console.log(`Input: [${input.join(', ')}]`);

    // Initialize data structures
    const entire_num_array = input;
    let Indices = ['i'];
    let Heads = ['i.head (data)'];
    let Tails = ['i.tail (next)'];

    // Build the linked list structure
    for (let i = 1; i <= entire_num_array.length; i++) {
        Indices.push(i);
        Heads.push(entire_num_array[i - 1]);
        Tails.push(i + 1);
    }
    Tails[entire_num_array.length] = 'Null';

    console.log("\nInitial structure:");
    printList(Indices, Heads, Tails);

    // Run merge sort (skip if empty)
    let resultHead = null;
    if (entire_num_array.length > 0) {
        resultHead = MergeSort(1, entire_num_array.length, 0);
    }

    console.log("\nAfter sorting:");
    printList(Indices, Heads, Tails);

    // Verify result
    const sorted = extractValues(resultHead);
    const expected = [...input].sort((a, b) => a - b);
    const passed = arraysEqual(sorted, expected);

    console.log(`\nResult: [${sorted.join(', ')}]`);
    console.log(`Expected: [${expected.join(', ')}]`);
    console.log(`Status: ${passed ? '✓ PASSED' : '✗ FAILED'}`);

    // Helper function: Extract sorted values from linked list
    function extractValues(head) {
        const values = [];
        let current = head;
        while (current !== 'Null' && current !== null) {
            values.push(Heads[current]);
            current = Tails[current];
        }
        return values;
    }

    // Helper function: Compare arrays
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Helper function: Print list structure
    function printList(Indices, Heads, Tails) {
        console.log("Indices:", Indices.slice(1).join(' → '));
        console.log("Values: ", Heads.slice(1).join(' → '));
        console.log("Next:   ", Tails.slice(1).map(t => t === 'Null' ? 'Null' : t).join(' → '));
    }

    // The actual MergeSort function (without chunker.add calls)
    function MergeSort(L, len, depth) {
        if (len > 1) {
            let midNum = Math.floor(len / 2);
            let Mid = L;

            // Find midpoint
            for (let i = 1; i < midNum; i++) {
                Mid = Tails[Mid];
            }

            // Split at Mid
            let R = Tails[Mid];
            Tails[Mid] = 'Null';

            // Recursively sort left and right
            L = MergeSort(L, midNum, depth + 1);
            R = MergeSort(R, len - midNum, depth + 1);

            // Merge L and R
            let M; // result

            // Choose initial head
            if (Heads[L] <= Heads[R]) {
                M = L;
                L = Tails[L];
            } else {
                M = R;
                R = Tails[R];
            }

            // Scan through adding elements to the end of M
            let E = M;
            while (L !== 'Null' && R !== 'Null') {
                if (Heads[L] <= Heads[R]) {
                    Tails[E] = L;
                    E = L;
                    L = Tails[L];
                } else {
                    Tails[E] = R;
                    E = R;
                    R = Tails[R];
                }
            }

            // Append remaining elements
            if (L === 'Null') {
                Tails[E] = R;
            } else {
                Tails[E] = L;
            }

            L = M; // Return merged result
        }

        return L;
    }
}

// Run all tests
testMergeSort();




/* Terminal Results, confirming correctness of Merge Sort implementation
=== Testing Merge Sort Logic ===


--- Test: Normal unsorted ---
Input: [5, 3, 8, 1]

Initial structure:
Indices: 1 → 2 → 3 → 4
Values:  5 → 3 → 8 → 1
Next:    2 → 3 → 4 → Null

After sorting:
Indices: 1 → 2 → 3 → 4
Values:  5 → 3 → 8 → 1
Next:    3 → 1 → Null → 2

Result: [1, 3, 5, 8]
Expected: [1, 3, 5, 8]
Status: ✓ PASSED

--- Test: Already sorted ---
Input: [1, 3, 5, 8]

Initial structure:
Indices: 1 → 2 → 3 → 4
Values:  1 → 3 → 5 → 8
Next:    2 → 3 → 4 → Null

After sorting:
Indices: 1 → 2 → 3 → 4
Values:  1 → 3 → 5 → 8
Next:    2 → 3 → 4 → Null

Result: [1, 3, 5, 8]
Expected: [1, 3, 5, 8]
Status: ✓ PASSED

--- Test: Reverse sorted ---
Input: [8, 5, 3, 1]

Initial structure:
Indices: 1 → 2 → 3 → 4
Values:  8 → 5 → 3 → 1
Next:    2 → 3 → 4 → Null

After sorting:
Indices: 1 → 2 → 3 → 4
Values:  8 → 5 → 3 → 1
Next:    Null → 1 → 2 → 3

Result: [1, 3, 5, 8]
Expected: [1, 3, 5, 8]
Status: ✓ PASSED

--- Test: Single element ---
Input: [5]

Initial structure:
Indices: 1
Values:  5
Next:    Null

After sorting:
Indices: 1
Values:  5
Next:    Null

Result: [5]
Expected: [5]
Status: ✓ PASSED

--- Test: Two elements ---
Input: [8, 3]

Initial structure:
Indices: 1 → 2
Values:  8 → 3
Next:    2 → Null

After sorting:
Indices: 1 → 2
Values:  8 → 3
Next:    Null → 1

Result: [3, 8]
Expected: [3, 8]
Status: ✓ PASSED

--- Test: With duplicates ---
Input: [5, 3, 5, 1, 3]

Initial structure:
Indices: 1 → 2 → 3 → 4 → 5
Values:  5 → 3 → 5 → 1 → 3
Next:    2 → 3 → 4 → 5 → Null

After sorting:
Indices: 1 → 2 → 3 → 4 → 5
Values:  5 → 3 → 5 → 1 → 3
Next:    3 → 5 → Null → 2 → 1

Result: [1, 3, 3, 5, 5]
Expected: [1, 3, 3, 5, 5]
Status: ✓ PASSED
*/