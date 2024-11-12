import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
// Sort list(head) in ascending order
MergeSort(L,R) \\B Main 
split \\Ref section1
merge \\B 8
1 \\B 9
1 \\B 10
1 \\B 11
1 \\B 12
1 \\B 13
14 \\B 14
15 \\B 15
16 \\B 16
17 \\B 17
1 \\B 18
1 \\B 19
1 \\B 20
\\Code}

\\Code{
section1
    1 \\B 1
    1 \\B 2
    1 \\B 3
    1 \\B 4
    1 \\B 5
ms left \\B 6
ms right \\B 7
\\Code}
`);
