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
    let newValue = e.target.value; 

    // Ensure only numeric values are allowed
    if (!/^\d+$/.test(newValue) && newValue !== "") {
      return;
    } 

    // Remove leading zeros
    newValue = String(parseInt(newValue, 10) || 0);

    if (algo === 'transitiveClosure' || algo === 'BFS'
    || algo === 'DFS') {
      // eslint-disable-next-line radix
      if (parseInt(newValue) > 1) {
        newValue = '1';
      }
      // eslint-disable-next-line radix
      if (parseInt(newValue) < 0) {
        newValue = '0';
      }
      // window.alert(id[3]);
      // eslint-disable-next-line radix
      if (index === parseInt(id[3])) {
        newValue = '1';
      }
    }  
  
    //make sure the diagonal is 0
    if (algo != 'transitiveClosure'){
      if (index === parseInt(id[3])) {
        newValue = '0';
      }
    }


    if (newValue === "") {
      newValue = '0';
    }  
    
    setValue(newValue); 
    
    
    
    //setValue(e.target.value); 

    // Update data immediately on value change
    updateData(index, id, newValue);
  };

  // update the data when the input is blurred
  const onBlur = () => {
    //updateData(index, id, value);
  }; 
  
 


  // If the initialValue is changed external,
  // sync it up with the initial state
  useEffect(() => {
    setValue(initialValue || 0);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

export default EditableCell;
