import styles from "./TouchscreenControls.module.css";

interface TouchscreenControlsProps {
  triggerLeft: () => void;
  triggerRight: () => void;
  pauseGame: () => void;
}

export default function TouchscreenControls({triggerLeft, triggerRight, pauseGame}: TouchscreenControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={`${styles.textbutton} ${styles.left}`} onClick={pauseGame}>
        Pause
      </div>
      <div className={`${styles.roundbutton} ${styles.left}`} onClick={triggerLeft}>
        <img className="unselectable" src="/Images/LeftArrow.svg"/>
      </div>
      <div className={`${styles.roundbutton} ${styles.right}`} onClick={triggerRight}>
        <img className="unselectable" src="/Images/RightArrow.svg"/>
      </div>
    </div>
  );
}
