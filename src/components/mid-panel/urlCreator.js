
export function createUrl(baseUrl, category, context) {
   const { 
     nodes, 
     searchValue, 
     graphSize, 
     graphStart, 
     graphEnd, 
     heuristic, 
     graphMin, 
     graphMax,
     compressed,
     small
   } = context;

   let url = baseUrl;
 
   switch (category) {
     case 'Sort':
       url += `&list=${nodes}`;
       break;
 
     case 'Insert/Search':
       if (['AVLTree', 'binarySearchTree', 'BSTrec'].includes(new URL(baseUrl).searchParams.get('alg'))) {
         const combinedUrl = new URL(baseUrl);
         combinedUrl.searchParams.set('mode', 'operations');
         combinedUrl.searchParams.set('list', String(nodes));
         url = combinedUrl.toString();
       } else {
         url += `&list=${nodes}&value=${searchValue}&smallTable=${small}`;
       }
       break;
 
     case 'String Search':
       url += `&string=${nodes}&pattern=${searchValue}`;
       break;
 
     case 'Set':
       url += `&union=${nodes}&value=${searchValue}&compress=${compressed}`;
       break;
 
     case 'Graph':
       url += `&size=${graphSize}&start=${graphStart}&end=${graphEnd}&xyCoords=${nodes}&edgeWeights=${searchValue}&heuristic=${heuristic}
         &min=${graphMin}&${graphMax}`;
       break;
 
     default:
       break;
   }
 
   return url;
 }
