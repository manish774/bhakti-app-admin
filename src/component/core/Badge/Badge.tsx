import "./Badge.css";
import type { BadgeProps } from "./BadgeModel";

const Badge = (props: BadgeProps<string>) => {
  const {
    label,
    bgColor = "red",
    size = "medium",
    type = "default",
    theme = "primary",
    style,
  } = props;
  console.log(bgColor);
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
