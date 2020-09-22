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
}) => {
  const [value, setValue] = useState(initialValue || 0);

  const onChange = (e) => {
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
