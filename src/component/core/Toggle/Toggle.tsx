import React from "react";
import "./Toggle.css";
import { Input } from "../generic";
const Toggle = ({ style, label, onToggle }: any) => {
  return (
    <div style={style}>
      <label className="label">
        <div className="toggle">
          <Input
            className="toggle-state"
            type="checkbox"
            value="check"
            onchangeHandler={() => {
              onToggle();
            }}
          />
          <div className="indicator"></div>
        </div>
        <div className="label-text">{label}</div>
      </label>
    </div>
  );
};

export default Toggle;
