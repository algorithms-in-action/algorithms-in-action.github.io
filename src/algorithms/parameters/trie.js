import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { URLContext } from '../../context/urlState';
import { GlobalActions } from '../../context/actions';
import SymbolListParam from './helpers/SymbolListParam';
import { withAlgorithmParams } from './helpers/urlHelpers';
import { binaryOperationListValidCheck } from './helpers/InputValidators';
import { errorParamMsg } from './helpers/ParamMsg';

// A key is inserted, ?key searches for it.
const DEFAULT_KEYS = ['5', '7', '2', '?7', '?3'];
const EXAMPLE = '5,7,?5,2';

function TrieParam({ list }) {
  const { dispatch } = useContext(GlobalContext);
  const { setNodes } = useContext(URLContext);
  const [keys, setKeys] = useState(list || DEFAULT_KEYS);
  const [message, setMessage] = useState(null);
  useEffect(() => { setNodes(keys); }, [keys, setNodes]);

  const run = event => {
    event.preventDefault();
    const input = event.target[0].value.replace(/\s+/g, '');
    const { valid, error, operations } = binaryOperationListValidCheck(input);
    if (!valid) {
      setMessage(errorParamMsg(error, EXAMPLE));
      return;
    }
    setMessage(null);
    dispatch(GlobalActions.RUN_ALGORITHM, { name: 'trie', mode: 'operations', operations });
  };

  return (
    <>
      <div className="form">
        <SymbolListParam name="trie" buttonName="Insert & Search" mode="operations"
          formClassName="formLeft" DEFAULT_VAL={keys} SET_VAL={setKeys}
          REFRESH_FUNCTION={() => DEFAULT_KEYS} ALGORITHM_NAME="operations"
          setMessage={setMessage} handleSubmit={run} />
      </div>
      <p className="generalText">0 goes left; 1 goes right. Green outlines mark stored keys. Put ? before a key to search for it.</p>
      {message}
    </>
  );
}

TrieParam.propTypes = { list: PropTypes.oneOfType([PropTypes.string, PropTypes.array]) };
TrieParam.defaultProps = { list: '' };
export default withAlgorithmParams(TrieParam);
