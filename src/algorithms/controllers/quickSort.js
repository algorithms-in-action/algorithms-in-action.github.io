import { initVisualisers , run_QS } from './quickSort_shared'
import { QSExp } from '../explanations';

const is_qs_median_of_3 = false;
const run = run_QS(is_qs_median_of_3);

export default {

    explanation: QSExp,
    initVisualisers, 
    run

};
