import parse from '../../pseudocode/parse';

export default parse(`
\\Code{
    Shorten_path
        parent[n] <- parent[parent[n]] (if enabled) // point to grandparent, not parent \\B parent[n] <- parent[parent[n]]
        \\Expl{ By replacing the parent pointer by a pointer to the
            grandparent at each step up the tree, the path length is
            halved. This turns out to be sufficient to keep paths very
            short. Note that the root node is its own parent.
            The animation allows this path compression to be disabled so
            you can compare the relative heights of the trees produced.
        \\Expl} 
\\Code} 
    
\\Code{
    Main
    Find(n) // return root of tree containing n \\B Find(n)
    \\In{
        while n != parent[n]  // while we are not at the root \\B while n != parent[n]
        \\In{
            shorten path from n to root \\Ref Shorten_path
            \\Expl{ There are several ways of shortening the path back to the
                    root. The most obvious is to follow the path to the root
                    then follow it again, making each element point to the
                    root. The version here doesn't shorten the path as much
                    but is simpler and overall it works extremely well.
                    The animation allows path compression to be disabled so
                    you can compare the relative heights of the trees produced.
            \\Expl} 
            n <- parent[n]  // go up the tree one step \\B n <- parent[n]
        \\In}
        return n // return root \\B return n
    \\In} 
    \\Code}
`);
