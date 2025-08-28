import React from "react";

const CheckboxInput = ({
  id,
  name,
  sidebarData,
  handleChange,
  value,
  purpose,
  htmlFor,
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={sidebarData.purpose === purpose}
        onChange={handleChange}
        className="peer relative appearance-none w-5 h-5 border border-orange rounded-md cursor-pointer focus:outline-none checked:bg-orange hover:ring-1 hover:ring-orange after:contemt-[''] after:w-full after:h-full after:top-0 after:left-0"
      />
      <label htmlFor={htmlFor} className="text-white text-lg cursor-pointer">
        {value}
      </label>
    </div>
  );
};

export default CheckboxInput;
