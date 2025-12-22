import styles from "./GameMode.module.css";

import CustomFont from "next/font/local";

const handwrittenSimlishFont = CustomFont({
  src: "../public/Fonts/Handwritten Simlish.woff2",
  fallback: ["sans-serif"]
});

function Description({content}: {content: string[] | string}) {
  if (typeof content === "string") {
    return (
      <p>{content}</p>
    );
  }
  return (
    <ul className={styles.description}>
      {
        content.map((item, index) => (
          <li key={index}>- {item}</li>
        ))
      }
    </ul>
  );
}

interface GameModeProps {
  children?: React.ReactNode;
  name: string;
  description: string[] | string;
  selected?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function GameMode({children, name, description, selected = false, onClick}: GameModeProps) {
  return (
    <div className={selected ? `${styles.box} ${styles.selected} unselectable` : `${styles.box} unselectable`} style={{width: 300}} onClick={onClick}>
      <h1>
        <span>{name}</span>
        <br/>
        <span className={handwrittenSimlishFont.className} style={{fontSize: 20, fontWeight: "normal"}}>{name}</span>
      </h1>
      <Description content={description}/>
      {children}
    </div>
  );
}
