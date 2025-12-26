import React, { useEffect, useMemo, useState } from "react";
import { generateRandomString } from "../../utils/Index";

type Options = {
  name: string | JSX.Element | number;
  value: any;
};
interface SelectProps {
  options: Options[];
  onchangeHandler: (e: any) => any;
  selected?: any;
  label?: JSX.Element | string | number;
  labelPosition?: "left" | "right" | "above" | "below";
}
const Select = (props: SelectProps) => {
  const [options, setOptions] = useState<Options[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>(props?.selected);

  useEffect(() => {
    setOptions(props?.options || []);
  }, [props?.options]);

  const prepareOption = useMemo(
    () =>
      (options || []).map((option) => (
        <option
          value={option?.value}
          className={
            `${selectedValue}` === `${option?.value}` ? "selected-option" : ""
          }
          key={generateRandomString(10)}
        >
          {option?.name}
        </option>
      )),
    [options, selectedValue]
  );

  return (
    <div>
      <label htmlFor={`${props?.options[0]?.value}`}>{props?.label}:</label>
      <select
        className={"neumorphic-select"}
        onChange={(e) => {
          props?.onchangeHandler(e);
          setSelectedValue(e.target.value);
        }}
        id={`${props?.options[0]?.value}`}
        style={{ height: "40px" }}
        value={selectedValue} // Set the selected value here
      >
        <option value="">Select</option>
        {prepareOption}
      </select>
    </div>
  );
};

export default Select;
