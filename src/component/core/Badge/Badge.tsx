import React from "react";
import "./Badge.css";
import { createUseStyles } from "react-jss";
import { BadgeProps } from "./BadgeModel";

const Badge = (props: BadgeProps<string>) => {
  const {
    label,
    bgColor = "red",
    size = "medium",
    type = "default",
    theme = "primary",
    style,
  } = props;
  return (
    <span
      className={`badge ${size} ${theme}`}
      data-badge-type={type}
      style={style}
    >
      {label}
    </span>
  );
};

export default Badge;
