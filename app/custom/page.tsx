"use client";
import {useState, useEffect} from "react";

import {useRouter, useSearchParams} from "next/navigation";

import Game from "@/components/Game";
import {getRandomHexColor, validateAsOddInteger, validateAsInteger, validateAsFloat} from "@/lib/utility";

export default function CustomMode() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const gameWidth: number = validateAsOddInteger(searchParams.get("width"), 3, 9) || 5;
  const gameHeight: number = validateAsOddInteger(searchParams.get("height"), 3, 15) || 7;
  const numberOfColors: number = validateAsInteger(searchParams.get("colors") || searchParams.get("color"), 2, 10) || 6;
  const gameSpeedAcceleration: number = validateAsFloat(searchParams.get("acceleration"), 0.05, 0.95) || 0.09;
  const awardingPoints: number = validateAsInteger(searchParams.get("awardpoints"), 0) || 1000;
  const pointsPerLevel: number = validateAsInteger(searchParams.get("levelincrement"), 100) || 4000;
  const levelToStart: number = validateAsInteger(searchParams.get("startinglevel"), 1, 100) || 1;

  const colors: string[] = [];
  for (let i = 0; i < numberOfColors; i++) {
    colors.push(getRandomHexColor());
  }

  const [gameKey, setGameKey] = useState<number>(0);

  const resetGame = () => {
    setGameKey(previous => previous + 1);
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("width") !== gameWidth.toString()) {
      params.set("width", gameWidth.toString());
    }
    if (params.get("height") !== gameHeight.toString()) {
    params.set("height", gameHeight.toString());
    }
    if (params.get("colors") !== numberOfColors.toString()) {
      params.set("colors", numberOfColors.toString());
    }
    if (params.get("acceleration") !== gameSpeedAcceleration.toString()) {
      params.set("acceleration", gameSpeedAcceleration.toString());
    }
    if (params.get("awardpoints") !== awardingPoints.toString()) {
      params.set("awardpoints", awardingPoints.toString());
    }
    if (params.get("levelincrement") !== pointsPerLevel.toString()) {
      params.set("levelincrement", pointsPerLevel.toString());
    }
    if (params.get("startinglevel") !== levelToStart.toString()) {
      params.set("startinglevel", levelToStart.toString());
    }
    router.replace(`?${params.toString()}`);
  }, []);

  return (
    <>
      <title>Blicblock - Custom Mode</title>
      <div className="gamecontent">
        <Game key={gameKey} width={gameWidth} height={gameHeight} blockSize={100} blockGap={4} blockColors={colors} dropSpeedAcceleration={gameSpeedAcceleration} pointsPerTetromino={awardingPoints} levelUpIncrement={pointsPerLevel} startingLevel={levelToStart} onReset={resetGame}/>
      </div>
    </>
  );
}
