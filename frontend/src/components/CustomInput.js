// CustomInput.jsx
import React, { forwardRef } from "react";

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="custom-textfield" onClick={onClick} ref={ref}>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly
      className="custom-input"
    />
    <span className="calendar-icon">📅</span>
  </div>
));

export default CustomInput;