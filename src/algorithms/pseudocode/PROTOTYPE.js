import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
Main
// Sort list(head) in ascending order
Mergesort(head) \\B 1
\\Expl{  Linked lists only support sequential access of data so we need the head 
to linearly iterate through the list.
\\Expl}
    if (head == null || head.next == null) \\B 2
    \\Expl{  Terminating condition (if there are less than two
            elements in the list segment do nothing).
    \\Expl}
    \\In{
        Split lists into 2 sections \\Ref SplitList
        \\Expl{ This function will split the lists into two halves
        \\Expl}
        Sort FirstPart \\Ref MergeSortFirstPart
        \\Expl{ Recursively sort first half of the list
        \\Expl}
        Sort SecondPart \\Ref MergeSortSecondPart
        \\Expl{ Recursively sort second half of the list
        \\Expl}
        Merge LeftAndRight \\Ref MergeLeftRight
        \\Expl{ Merge two sorted halves
        \\Expl}
    \\In}
    //Done \\B 8
\\Code}

\\Code{
SplitList
// Split the linked list into two halves 
SplitList(head) \\B placeholder
    if (head == NULL || head.next == NULL) \\B 2
        left <- head \\B placeholder
        right <- NULL \\B placeholder
    else  \\B 201
        slow <- head \\B 201
        fast <- head \\B 201
        while (fast.next != NULL && fast.next.next != NULL) \\B 202
            slow = slow.next \\B 203
            fast = fast.next.next \\B 203
        left <- head \\B 204
        right <- slow.next \\B 204
        slow.next <- NULL \\B 204
\\Code}

\\Code{
MergeSortFirstPart
// *Recursively* sort first part: \\B 300
Mergesort(left) \\B 3
\\Code}

\\Code{
MergeSortSecondPart
// *Recursively* sort second part: \\B 400
Mergesort(right) \\B 4
\\Code}

\\Code{
MergeLeftRight
// Merge two lists
MergeLeftRight(left, right) \\B placeholder
    left_pointer <- left \\B 5
    right_pointer <- right \\B 6
    
    if (left == NULL) \\B placeholder
        result <- right \\B 7
    else if (right == NULL) \\B placeholder
        result <- left \\B 7
    else if (left.data <= right.data) \\B placeholder
        result <- left \\B 7
        result.next = MergeLeftRight(result.next, right) \\B placeholder
    else  \\B placeholder
        result <- right \\B 7
        result.next = MergeLeftRight(left, result.next) \\B placeholder
\\Code}
`);
