/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import '../../styles/Param.scss';

function ParamForm(props) {
  const {
    formClassName, name, value, onChange, handleSubmit, children,
  } = props;

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className="outerInput">
        <label className="inputText">
          <input
            name={name}
            type="text"
            value={value}
            // data-testid="insertionText"
            onChange={onChange}
          />
        </label>
        <div className="btnGrp">
          {children}
        </div>
      </div>
    </form>
  );
}

export default ParamForm;
