"use client";
import {useState} from "react";

import Game from "@/components/Game";

export default function NormalMode() {
  const colors: string[] = [
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
      <title>Blicblock - Normal Mode</title>
      <div className="gamecontent">
        <Game key={gameKey} width={5} height={7} blockSize={100} blockGap={4} blockColors={colors} dropSpeedAcceleration={0.09} levelUpIncrement={4000} onReset={resetGame}/>
      </div>
    </>
  );
}
