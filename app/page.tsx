"use client";
import styles from "./page.module.css";

import {useState} from "react";

import Game from "@/components/Game";

export default function Home() {
  const colors = [
    "#ffffff",
    "#5ac6db",
    "#e022b1",
    "#fae07f",
    "#a4f558",
    "#d98821"
  ];
  const [gameKey, setGameKey] = useState<number>(0);

  const resetGame = () => {
    setGameKey(previous => previous + 1);
  }

  return (
    <>
      <div className={styles.content}>
        <Game key={gameKey} width={5} height={7} blockSize={100} blockGap={4} blockColors={colors} dropSpeedAccerlation={0.09} onReset={resetGame}/>
      </div>
    </>
  );
}
