import React from "react";
import { CircleBadgeProps } from "./BadgeModel";
import "./CircleBadge.scss";

const CircleBadge = (props: CircleBadgeProps<string>) => {
  const {
    labels,
    size = "medium",
    customColor,
    type = "primary",
    style,
    title,
  } = props;

  const colorCombination = [];
  const mLabel = labels?.map((label) => (
    <span
      className={`badge-circle-container ${size} ${type}`}
      title={label}
      key={label}
      style={style}
    >
      {label?.split(" ")?.map((l) => l[0]?.toUpperCase())}
    </span>
  ));

  return <>{mLabel}</>;
};

export default CircleBadge;
