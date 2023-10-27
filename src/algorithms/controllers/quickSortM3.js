import { initVisualisers , run_QS } from './quickSort_shared'
import { QSM3Exp } from '../explanations';

const is_qs_median_of_3 = true;
const run = run_QS(is_qs_median_of_3);
export default {
    explanation: QSM3Exp,
    initVisualisers, 
    run
};
