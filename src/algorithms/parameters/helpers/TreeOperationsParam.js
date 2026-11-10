import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { URLContext } from '../../../context/urlState';
import SymbolListParam from './SymbolListParam';
import { withAlgorithmParams } from './urlHelpers';
import {
  genUniqueRandSearchList, shuffleArray,
  sortAndInterleaveSearches, balancedAndInterleaveSearches,
} from './InputBuilders';
import { legacyTreeInput, treeInputTokens } from './treeInput';

export function TreeOperationsParam({ name, count, list, mode, value }) {
  const [nodes, setLocalNodes] = useState(() => legacyTreeInput(
    list || (mode === 'search' ? [] : genUniqueRandSearchList(count, 1, 100)), mode, value,
  ));
  const [message, setMessage] = useState(null);
  const [order, setOrder] = useState('');
  const { setNodes, setSearchValue } = useContext(URLContext);
  const form = useRef(null);
  const submitAfterUpdate = useRef(false);

  useEffect(() => {
    setNodes(nodes);
    setSearchValue('');
  }, [nodes, setNodes, setSearchValue]);

  useEffect(() => {
    if (submitAfterUpdate.current) {
      submitAfterUpdate.current = false;
      form.current.querySelector('button[type="submit"]').click();
    }
  }, [nodes]);

  const updateNodes = next => {
    setLocalNodes(next);
    setOrder('');
  };

  const reorder = event => {
    const selected = event.target.name;
    try {
      const tokens = treeInputTokens(nodes);
      const builders = {
        random: shuffleArray,
        sorted: sortAndInterleaveSearches,
        balanced: balancedAndInterleaveSearches,
      };
      const next = builders[selected](tokens);
      submitAfterUpdate.current = true;
      setOrder(selected);
      setLocalNodes(next);
      setMessage(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <div className="form" ref={form}>
        <SymbolListParam
          name={name}
          buttonName="Insert & Search"
          mode="operations"
          formClassName="formLeft"
          DEFAULT_VAL={nodes}
          SET_VAL={updateNodes}
          REFRESH_FUNCTION={() => {
            submitAfterUpdate.current = true;
            return genUniqueRandSearchList(count, 1, 100);
          }}
          ALGORITHM_NAME="operations"
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Re-order input: &nbsp;&nbsp;</span>
      {['random', 'sorted', 'balanced'].map(option => (
        <FormControlLabel
          key={option}
          control={<Radio color="primary" checked={order === option} onChange={reorder} name={option} />}
          label={option.charAt(0).toUpperCase() + option.slice(1)}
          className="checkbox"
        />
      ))}
      {message}
    </>
  );
}

TreeOperationsParam.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number,
  list: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  mode: PropTypes.string,
  value: PropTypes.string,
};

TreeOperationsParam.defaultProps = { count: 12, list: '', mode: 'operations', value: '' };

export default withAlgorithmParams(TreeOperationsParam);
