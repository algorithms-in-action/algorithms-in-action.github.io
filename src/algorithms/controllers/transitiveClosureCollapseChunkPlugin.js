import {GlobalActions} from "../../context/actions";

/*
 * @Author: huimin huang
 * @Date: 2021-10-05
 * @FilePath: /src/algorithms/controllers/transitiveClosureCollapseChunkPlugin.js
 * @Description: transitiveClosure logical of chunker when collapsed
 */
const TC_NAME = "transitiveClosure";

let algorithmGetter = ()=>null;
let dispatchGetter = ()=>null;

function getGlobalAlgotithm(){
    return algorithmGetter();
}
function getGlobalDispatch(){
    return dispatchGetter();
}

window.getGlobalAlgotithm = getGlobalAlgotithm;
export function initGlobalAlgotithmGetter(getter, dispatchGetterFn){
    algorithmGetter = getter;
    dispatchGetter = dispatchGetterFn;
}

export function isCurrentLineInCollapseState(){
    const algorithm = getGlobalAlgotithm();
    const name = algorithm.id.name;

    if(name !== TC_NAME) return false;

    // , playing, chunker
    const {bookmark, pseudocode, collapse} = algorithm;

    if(collapse.transitiveClosure.tc.Collapse) return false;
    
    const {Collapse} = pseudocode;
    
    return Collapse.find(item=>item.bookmark === bookmark);
}

export function isInCollapseState(){
    const algorithm = getGlobalAlgotithm();

    return !algorithm.collapse.transitiveClosure.tc.Collapse;
}

let chunkCache = [];

export function runChunkWithCheckCollapseState(chunkFn){
    if(isInCollapseState()){
        chunkCache.push(chunkFn);
    }else{
        chunkFn();
    }
}

export function releaseChunkCache(){
    chunkCache.forEach(fn=>{fn()});
    chunkCache = [];
}

export function runChunkWithEnterCollapse(){
    if(isInCollapseState()){
        const algorithm = getGlobalAlgotithm();
        const dispatch = getGlobalDispatch();
        if(!algorithm.chunker._inPrevState){
            setTimeout(()=>{
                dispatch(GlobalActions.NEXT_LINE, {
                    triggerPauseInCollapse: true,
                    playing: algorithm.playing
                });
            })
        }
    }
}