import React, { useEffect, useState, forwardRef } from "react";
import { useDebounce } from "../../hooks/hooks";
import "./generic.scss";
import { InputProps } from "../../Model/Input.module";

const Input = forwardRef<HTMLInputElement, InputProps<string | number>>(
  (props, ref) => {
    const { onchangeHandler, className, debounceTime = 100 } = props;
    const {
      id,
      key,
      type,
      min,
      max,
      placeholder,
      multiple,
      otherProps,
      style,
      disabled,
      label,
      labelPosition,
    } = props || {};
    const [inputValue, setInputValue] = useState<any>(
      props?.value || props?.min || undefined
    );
    const [eventObject, setEventObject] = useState<any>();
    const debounceInput = useDebounce(eventObject, debounceTime);
    const labelPositionClasses = {
      left: "left",
      right: "right",
      above: "above",
      below: "below",
    };

    useEffect(() => {
      onchangeHandler(debounceInput);
    }, [debounceInput]);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        props?.type === "number" &&
        props?.max &&
        parseInt(e?.target?.value) > props?.max
      ) {
        return e.preventDefault();
      }
      setEventObject(e);
      setInputValue(e?.target?.value);
    };

    const labelPostionClass = () => {
      props?.labelPosition === "left";
    };

    return (
      <>
        <label
          className={`label-${labelPositionClasses[labelPosition || "left"]}`}
        >
          {label}
        </label>
        <input
          id={id}
          key={key}
          ref={ref}
          type={type}
          onChange={changeHandler}
          value={inputValue}
          min={min}
          max={max}
          placeholder={placeholder}
          multiple={multiple || false}
          {...otherProps}
          style={style}
          className={className}
          disabled={disabled || false}
        />
      </>
    );
  }
);

export default Input;
