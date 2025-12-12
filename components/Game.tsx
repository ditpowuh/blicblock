"use client";
import styles from "./Game.module.css";

import {useState, useEffect, useRef} from "react";

import Block from "@/components/Block";
import {randomNumber, generateEmptyGrid} from "@/lib/utility";

import CustomFont from "next/font/local";

const handwrittenSimlishFont = CustomFont({
  src: "../public/Fonts/Handwritten Simlish.woff2",
  fallback: ["sans-serif"]
});

type BlockID = number;

interface GameProps {
  width: number;
  height: number;
  blockSize: number;
  blockGap: number;
  blockColors: string[];
}

export default function Game({width, height, blockSize, blockGap, blockColors}: GameProps) {
  const [currentBlockPosition, setCurrentBlockPosition] = useState<{x: number, y: number}>({x: Math.ceil(width / 2), y: 1});
  const [currentBlockQueue, setCurrentBlockQueue] = useState<number[]>(Array.from({length: 3}, () => randomNumber(1, blockColors.length)));

  const [boardState, setBoardState] = useState<BlockID[][]>(generateEmptyGrid(width, height));

  const [dropSpeed, setDropSpeed] = useState<number>(1000);
  const [mounted, setMounted] = useState<boolean>(false);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gamePause, setGamePause] = useState<boolean>(false);

  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  const lastTime = useRef<number>(0);
  const lastDrop = useRef<number>(0);
  const delay = useRef<number>(0);

  const rafID = useRef<number>(0);

  const colors: Record<number, string> = Object.fromEntries(blockColors.map((color, index) => [index + 1, color]));

  const sizing: React.CSSProperties = {
    width: blockSize * width + blockGap * (width - 1),
    height: blockSize * height  + blockGap * (height - 1),
    gridTemplateColumns: `repeat(${width}, ${blockSize}px)`,
    gridTemplateRows: `repeat(${height}, ${blockSize}px)`,
    gap: blockGap
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
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
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    }
  }, [boardState, height, width]);

  useEffect(() => {
    const update = (time: number) => {
      const delta = time - lastTime.current;
      lastTime.current = time;

      if (lastTime.current > lastDrop.current + dropSpeed + delay.current && !gameOver) {
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

              const newBlock = randomNumber(1, blockColors.length);
              return [...currentBlockQueue.slice(1), newBlock];
            });
          }
          else {
            setGameOver(true);
          }

          return {x: Math.ceil(width / 2), y: 0};
        });

        lastDrop.current = lastTime.current;
      }

      rafID.current = requestAnimationFrame(update);
    };

    rafID.current = requestAnimationFrame(update);

    return () => {
      if (rafID.current) {
        cancelAnimationFrame(rafID.current);
      }
    };
  }, [boardState, dropSpeed]);

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
    </div>
  );
}
