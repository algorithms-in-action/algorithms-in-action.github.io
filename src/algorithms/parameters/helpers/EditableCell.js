/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

/**
 * Cell component
 */
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData,
  algo,
}) => {
  const [value, setValue] = useState(initialValue || 0);

  const onChange = (e) => {
    if (algo === 'transitiveClosure') {
      // eslint-disable-next-line radix
      if (parseInt(e.target.value) > 1) {
        e.target.value = '1';
      }
      // eslint-disable-next-line radix
      if (parseInt(e.target.value) < 0) {
        e.target.value = '0';
      }
    }
    setValue(e.target.value);
  };

  // update the data when the input is blurred
  const onBlur = () => {
    updateData(index, id, value);
  };

  // If the initialValue is changed external,
  // sync it up with the inital state
  useEffect(() => {
    setValue(initialValue || 0);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

export default EditableCell;
