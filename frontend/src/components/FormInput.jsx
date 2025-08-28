import { useState } from "react";

const FormInput = (props) => {
  const { className, errorMessage, handleChange, id, ...inputProps } = props;

  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="mt-4 flex flex-col w-full text-white">
      <input
        className={`reg-signin-input ${className || ""}`}
        {...inputProps}
        onChange={handleChange}
        onBlur={handleFocus}
        focused={focused.toString()}
      />
      <span className="inp-error hidden  p-1 text-[#ff8633] text-xs">
        {errorMessage}
      </span>
    </div>
  );
};

export default FormInput;
