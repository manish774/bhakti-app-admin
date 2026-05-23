import styles from "./Counts.module.css";

interface ICount<T> {
  count: number | string;
  size?: "large" | "small" | "x-small";
  title: string;
  variant?: "primary" | "success" | "warning" | "danger";
  onClick?: (prop: T) => void;
}

const Counts = <T,>({
  count,
  size = "x-small",
  title,
  variant = "primary",
  onClick,
}: ICount<T>) => {
  const sizeClass = size === "x-small" ? styles.xSmall : styles[size];

  return (
    <div
      className={`count-widget ${styles.countContainer} ${sizeClass} ${variant ? styles[variant] : ""}`}
      onClick={onClick && onClick}
    >
      <div className={styles.count}>{count}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default Counts;
