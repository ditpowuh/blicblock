import styles from "./Block.module.css";

interface BlockProps {
  color: string;
  x: number;
  y: number;
}

export default function Block({color = "#ffffff", x, y}: BlockProps) {
  const generatedBackground = {
    backgroundImage: `linear-gradient(to bottom, ${color}, ${color} 50%, color-mix(in srgb, ${color}, #000000 10%) 50%, color-mix(in srgb, ${color}, #000000 10%))`,
    backgroundSize: `100% ${100 / 4.5}%`
  };

  const position = {
    gridArea: (x == 0 || y == 0) ? "auto auto auto auto" : `${y} / ${x} / span 1 / span 1`
  };

  if (x === 0 || y === 0) {
    return null;
  }
  else {
    return (
      <div className={styles.block} style={{...generatedBackground, ...position}}></div>
    );
  }
}
