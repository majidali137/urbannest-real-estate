import React from "react";

const CheckboxTypeFilters = ({ item, parent, onChange, typeArray }) => {
  if (item.parent) {
    return (
      <div className="text-neutral-600">
        <h3 className="text-lg font-semibold">
          {item.name[0].toUpperCase()}
          {item?.name.slice(1)}
        </h3>
        <div className="flex w-full flex-wrap gap-2">
          {item.items.map((child) => (
            <CheckboxTypeFilters
              item={child}
              parent={parent}
              onChange={onChange}
              typeArray={typeArray}
            />
          ))}
        </div>
      </div>
    );
  } else {
    const checked = typeArray.some(
      (obj) => obj[`type.${parent}`] === item.name
    );
    return (
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id={item.id}
          name={item.name}
          checked={checked}
          onChange={(e) => onChange(e, parent)}
          className="peer relative appearance-none w-4 h-4 border border-orange rounded cursor-pointer focus:outline-none checked:bg-orange hover:ring-1 hover:ring-orange after:contemt-[''] after:w-full after:h-full after:top-0 after:left-0"
        />
        <label htmlFor={item.id} className="text-white cursor-pointer text-sm">
          {item.name}
        </label>
      </div>
    );
  }
};

export default CheckboxTypeFilters;
