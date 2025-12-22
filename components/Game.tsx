"use client";
import styles from "./Game.module.css";

import {useState, useEffect, useRef} from "react";

import {useRouter} from "next/navigation";

import Block from "@/components/Block";
import {getRandomNumber, generateEmptyGrid, processTetrominoes} from "@/lib/utility";

import type {BlockID} from "@/types";

import CustomFont from "next/font/local";

const handwrittenSimlishFont = CustomFont({
  src: "../public/Fonts/Handwritten Simlish.woff2",
  fallback: ["sans-serif"]
});

interface GameProps {
  width: number;
  height: number;
  blockSize: number;
  blockGap: number;
  blockColors: string[];
  startingLevel?: number;
  startingDropSpeed?: number;
  dropSpeedAcceleration: number;
  pointsPerTetromino?: number | number[];
  levelUpIncrement: number;
  onReset?: () => void;
}

export default function Game({width, height, blockSize, blockGap, blockColors, startingLevel = 1, startingDropSpeed = 1000, dropSpeedAcceleration, pointsPerTetromino = 1000, levelUpIncrement, onReset}: GameProps) {
  const router = useRouter();

  const [currentBlockPosition, setCurrentBlockPosition] = useState<{x: number, y: number}>({x: Math.ceil(width / 2), y: 1});
  const [currentBlockQueue, setCurrentBlockQueue] = useState<number[]>(Array.from({length: 3}, () => getRandomNumber(1, blockColors.length)));

  const [boardState, setBoardState] = useState<BlockID[][]>(generateEmptyGrid(width, height));

  const [dropSpeed, setDropSpeed] = useState<number>(startingDropSpeed);
  const [mounted, setMounted] = useState<boolean>(false);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gamePause, setGamePause] = useState<boolean>(false);

  const [startingScreenOn, setStartingScreenOn] = useState<boolean>(true);

  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  const fastDrop = useRef<boolean>(false);

  const lastTime = useRef<number>(0);
  const lastDrop = useRef<number>(0);
  const delay = useRef<number>(2000);

  const rafID = useRef<number>(0);

  const colors: Record<number, string> = Object.fromEntries(blockColors.map((color, index) => [index + 1, color]));

  const sizing: React.CSSProperties = {
    width: blockSize * width + blockGap * (width - 1),
    height: blockSize * height  + blockGap * (height - 1),
    gridTemplateColumns: `repeat(${width}, ${blockSize}px)`,
    gridTemplateRows: `repeat(${height}, ${blockSize}px)`,
    gap: blockGap
  };

  const unpauseGame = () => {
    setGamePause(false);
  }

  const goBack = () => {
    router.push("/");
  }

  useEffect(() => {
    setMounted(true);

    const startingScreenInterval = setInterval(() => {
      setStartingScreenOn(false);
    }, 2000);

    return () => {
      clearInterval(startingScreenInterval);
    }
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (startingScreenOn || gameOver) {
        return;
      }
      if (event.key === "Escape") {
        setGamePause(previousState => !previousState);
      }
      if (!gamePause) {
        if (event.key === "ArrowLeft") {
          setCurrentBlockPosition((previous) => {
            if (previous.x > 1 && previous.y > 0) {
              if (boardState[previous.y - 1][previous.x - 2] === 0) {
                return {x: previous.x - 1, y: previous.y};
              }
            }
            return previous;
          });
        }
        if (event.key === "ArrowRight") {
          setCurrentBlockPosition((previous) => {
            if (previous.x < width && previous.y > 0) {
              if (boardState[previous.y - 1][previous.x] === 0) {
                return {x: previous.x + 1, y: previous.y};
              }
            }
            return previous;
          });
        }
        if (event.key === "ArrowDown") {
          fastDrop.current = true;
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    }
  }, [boardState, height, width]);

  useEffect(() => {
    const update = (time: number) => {
      const delta = time - lastTime.current;
      if (!gameOver && !gamePause && !startingScreenOn) {
        lastTime.current = time;
      }

      const processedData = processTetrominoes(boardState, width, height, blockColors.length, typeof pointsPerTetromino === "number" ? [pointsPerTetromino, pointsPerTetromino] : pointsPerTetromino);
      if (processedData.points > 0) {
        setScore(score => score + processedData.points);
      }
      setBoardState(processedData.state);

      if ((lastTime.current > lastDrop.current + dropSpeed + delay.current || fastDrop.current === true) && !gameOver) {
        setCurrentBlockPosition((previous) => {
          if (previous.y < height) {
            if (boardState[previous.y][previous.x - 1] === 0) {
              return {x: previous.x, y: previous.y + 1};
            }
          }

          if (previous.y !== 0) {
            setCurrentBlockQueue((queue) => {
              const placed = currentBlockQueue[0];
              setBoardState((board) => {
                const newBoard = board.map(row => [...row]);
                newBoard[previous.y - 1][previous.x - 1] = placed;

                return newBoard;
              });

              const newBlock = getRandomNumber(1, blockColors.length);
              return [...currentBlockQueue.slice(1), newBlock];
            });
          }
          else {
            setGameOver(true);
          }
          fastDrop.current = false;

          return {x: Math.ceil(width / 2), y: 0};
        });

        lastDrop.current = lastTime.current;
        delay.current = 0;
      }

      rafID.current = requestAnimationFrame(update);
    }

    rafID.current = requestAnimationFrame(update);

    return () => {
      if (rafID.current) {
        cancelAnimationFrame(rafID.current);
      }
    }
  }, [boardState, dropSpeed]);

  useEffect(() => {
    setLevel(Math.floor(score / levelUpIncrement) + startingLevel);
  }, [score]);

  useEffect(() => {
    if (level !== startingLevel) {
      setDropSpeed(previous => previous - previous * dropSpeedAcceleration);
    }
  }, [level]);

  useEffect(() => {
    if (startingLevel > 1) {
      for (let i = 0; i < startingLevel - 1; i++) {
        setDropSpeed(previous => previous - previous * dropSpeedAcceleration);
      }
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`${styles.game} ${handwrittenSimlishFont.className}`}>
      <div className={styles.score} style={{width: blockSize * width + blockGap * (width - 1), fontSize: blockSize / 2, letterSpacing: blockSize / 15}}>
        <div className={`${styles.content} unselectable`} style={{paddingLeft: blockSize / 15}}>{score}</div>
      </div>
      <div className={styles.main}>
        <div className={styles.levelpanel} style={{width: blockSize * 1.5, height: blockSize * 1.5}}>
          <div className={`${styles.content} unselectable`}>
            <div style={{fontSize: blockSize / 3, marginTop: blockSize / 3}}>LEVEL</div>
            <div style={{fontSize: blockSize / 2, marginTop: blockSize / 9, letterSpacing: blockSize / 15}}>{level}</div>
          </div>
        </div>
        <div className={styles.board} style={{...sizing}}>
          {!gameOver && <Block color={colors[currentBlockQueue[0]]} x={currentBlockPosition.x} y={currentBlockPosition.y}/>}
          {
            boardState.map((row, rowIndex) => {
              return row.map((cell, colIndex) => {
                if (cell !== 0) {
                  return (
                    <Block key={`${rowIndex + 1}-${colIndex + 1}`} color={colors[cell]} x={colIndex + 1} y={rowIndex + 1}/>
                  );
                }
                return null;
              })
            })
          }
        </div>
        <div className={styles.upcomingpanel} style={{width: blockSize * 1.5, height: blockSize * 3}}>
          <div className={styles.upcomingblocks} style={{width: blockSize * 0.75, height: blockSize * 0.75, marginTop: blockSize * 1.5 / 4, marginBottom: blockSize * 1.5 / 2}}>
            <Block color={colors[currentBlockQueue[1]]}/>
          </div>
          <div className={styles.upcomingblocks} style={{width: blockSize * 0.75, height: blockSize * 0.75, marginTop: blockSize * 1.5 / 2, marginBottom: blockSize * 1.5 / 4}}>
            <Block color={colors[currentBlockQueue[2]]}/>
          </div>
        </div>
      </div>
      {(startingScreenOn || gameOver || gamePause) && <div className={styles.darkscreen}></div>}
      <div className={styles.overlayscreen} style={{display: !gameOver ? "none" : "inline"}}>
        <h1 className={styles.titletext} style={{fontSize: blockSize * 2, color: "#c49e23"}}>GAME OVER</h1>
        <div className={styles.bottomsection}>
          <div className={styles.regulartext}>
            <span>Your final score was:</span>
            <br/>
            <span style={{fontSize: "1.5em"}}>{score}</span>
          </div>
          <br/>
          {onReset && <><button className={`${styles.button} ${styles.regulartext}`} onClick={onReset}>Start a new game</button><br/></>}
          <button className={`${styles.button} ${styles.regulartext}`} onClick={goBack}>Go Back</button>
        </div>
      </div>
      <div className={`${styles.overlayscreen} ${styles.startscreen}`}>
        <h1 className={styles.titletext} style={{fontSize: blockSize * 2, color: "#70c7c4"}}>START</h1>
      </div>
      <div className={styles.overlayscreen} style={{display: !gamePause ? "none" : "inline"}}>
        <h1 className={styles.pausedtext} style={{fontSize: blockSize * 2}}>PAUSED</h1>
        <button className={`${styles.button} ${styles.regulartext}`} onClick={unpauseGame}>Resume Game</button>
        <br/>
        <button className={`${styles.button} ${styles.regulartext}`} onClick={goBack}>Go Back</button>
        <p className={styles.regulartext} style={{fontSize: 12}}>You can use ESC to pause/unpause.</p>
      </div>
    </div>
  );
}
