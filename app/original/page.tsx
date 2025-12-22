"use client";
import {useState} from "react";

import Game from "@/components/Game";

export default function OriginalMode() {
  const colors: string[] = [
    "#5ac6db",
    "#e022b1",
    "#fae07f",
    "#a4f558"
  ];
  const [gameKey, setGameKey] = useState<number>(0);

  const resetGame = () => {
    setGameKey(previous => previous + 1);
  }

  return (
    <>
      <title>Blicblock - Original Mode</title>
      <div className="gamecontent">
        <Game key={gameKey} width={5} height={7} blockSize={100} blockGap={4} blockColors={colors} dropSpeedAcceleration={0.15} pointsPerTetromino={[30000, 35000]} levelUpIncrement={30000} onReset={resetGame}/>
      </div>
    </>
  );
}
