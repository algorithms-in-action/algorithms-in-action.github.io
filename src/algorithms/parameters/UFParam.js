import React, { useState } from 'react';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_ELEMENTS = [[0, 1], [2, 3], [4, 5], [6, 7]];
const UNION_FIND = 'Union-Find';

function UFParam() {
  const [message, setMessage] = useState(null);
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);

  return (
    <>
      <div className="form">
        {/* Union-Find input */}
        <ListParam
          name="unionFind"
          buttonName="Union"
          mode="union"
          formClassName="formCenter"
          DEFAULT_VAL={elements}
          SET_VAL={setElements}
          ALGORITHM_NAME={UNION_FIND}
          EXAMPLE="Please follow the example provided: [0,1],[2,3],[4,5],[6,7]"
          setMessage={setMessage}
        />
      </div>
      {/* Render success/error message */}
      {message}
    </>
  );
}

export default UFParam;
