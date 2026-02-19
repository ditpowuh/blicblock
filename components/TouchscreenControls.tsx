import styles from "./TouchscreenControls.module.css";

interface TouchscreenControlsProps {
  triggerLeft: () => void;
  triggerRight: () => void;
}

export default function TouchscreenControls({triggerLeft, triggerRight}: TouchscreenControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={`${styles.button} ${styles.left}`} onClick={triggerLeft}>
        <img className="unselectable" src="/Images/LeftArrow.svg"/>
      </div>
      <div className={`${styles.button} ${styles.right}`} onClick={triggerRight}>
        <img className="unselectable" src="/Images/RightArrow.svg"/>
      </div>
    </div>
  );
}
