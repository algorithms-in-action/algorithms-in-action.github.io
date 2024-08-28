import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ This is a copied+modified version of the mergecode and quicksort pseudocode. 
It is adapted to linked lists.
\\Note}

\\Code{
Main
// Sort list(head) in ascending order
Mergesort(head) 
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

\\Code {
SplitList
// Split the linked list into two halves 
SplitList(head)
    if (head == NULL || head.next == NULL) \\B 2
        left <- head
        right <- NULL
    else 
        slow <- head
        fast <- head
        while (fast.next != NULL && fast.next.next != NULL) {
            slow = slow.next
            fast = fast.next.next
        }
        left <- head
        right <- slow.next \\B 9
        slow.next <- NULL
}
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
MergeLeftRight(left, right)
    left_pointer <- left \\B 5
    right_pointer <- right \\B 6
    
    if (left == NULL)
        result <- right \\B 7
    else if (right == NULL)
        result <- left \\B 7
    else if (left.data <= right.data)
        result <- left \\B 7
        result.next = MergeLeftRight(result.next, right)
    else 
        result <- right \\B 7
        result.next = MergeLeftRight(left, result.next)
\\Code}
`);
