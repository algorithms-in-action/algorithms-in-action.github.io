export default {
  pseudocode: `
procedure BinaryTreeSearch(Tree, Item):
  Ptr = Root;                   $1            (* Set search pointer Ptr to root *)
  while (Ptr Not Null)          $2            (* Continue searching until we go past a leaf to Null *)
    if(Ptr->Key == Item)        $3            (* Compare to see if keys match *)
      return FOUND              $4            (* Keys match, item has been found in tree *)
    else                        $5
      if(DataItem < Ptr->Key)   $6            (* Compare data item and the data pointed by the search pointer *)
        Ptr = Ptr->lchild       $7            (* Item key is less, so should follow the left child on search path. *)
      else                      $8            (* Item key is greater or equal to data pointed by the search pointer. *)
        Ptr = Ptr->rchild       $9            (* Item key is greater or equal, so should follow the right child on search path *)
      end if
    end if
  end while
  return NOTFOUND               $10           (* Following along the search path, item was not encountered, so it must not be in the tree. *)
`,
  explanation: `
This is a brief explanation of the binary tree search algorithm.

Ideally, this will support *markdown*.
`,
  run: () => {
    // Do stuff to actually run a binary tree search
  },
};
