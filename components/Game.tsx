"use client";
import styles from "./Game.module.css";

import {useState, useEffect, useRef, useReducer, useCallback} from "react";
import {useShallow} from "zustand/react/shallow";

import {useRouter} from "next/navigation";

import Block from "@/components/Block";
import TouchscreenControls from "@/components/TouchscreenControls";

import {GameState, createInitialState, gameReducer} from "@/lib/reducer/game";
import audio from "@/lib/audio";

import {useGlobalSettingsStore} from "@/stores/GlobalSettingsStore";

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
  pointsPerTetromino?: number | [number, number];
  levelUpIncrement: number;
  onReset?: () => void;
}

export default function Game({width, height, blockSize, blockGap, blockColors, startingLevel = 1, startingDropSpeed = 1000, dropSpeedAcceleration, pointsPerTetromino = 1000, levelUpIncrement, onReset}: GameProps) {
  const router = useRouter();

  const [touchscreenMode, muteAudio] = useGlobalSettingsStore(useShallow((state) => [state.touchscreenMode, state.muteAudio]));
  const [mounted, setMounted] = useState<boolean>(false);

  const pointsToAward: [number, number] = typeof pointsPerTetromino === "number" ? [pointsPerTetromino, pointsPerTetromino] : pointsPerTetromino;
  const numberOfColors: number = blockColors.length;

  const [state, dispatch] = useReducer(gameReducer, {
    width,
    height,
    numberOfColors,
    startingLevel,
    startingDropSpeed,
    dropSpeedAcceleration
  }, (config) => {
    return createInitialState(config.width, config.height, config.numberOfColors, config.startingLevel, config.startingDropSpeed, config.dropSpeedAcceleration);
  });

  const rafIDRef = useRef<number>(0);
  const stateRef = useRef<GameState>(state);

  const previousStateRef = useRef<GameState | null>(null);

  stateRef.current = state;

  const colors: Record<number, string> = Object.fromEntries(blockColors.map((color, index) => [index + 1, color]));

  const sizing: React.CSSProperties = {
    width: blockSize * width + blockGap * (width - 1),
    height: blockSize * height  + blockGap * (height - 1),
    gridTemplateColumns: `repeat(${width}, ${blockSize}px)`,
    gridTemplateRows: `repeat(${height}, ${blockSize}px)`,
    gap: blockGap
  };

  const pauseGame = useCallback(() => {
    dispatch({type: "Pause"});
  }, []);

  const unpauseGame = useCallback(() => {
    dispatch({type: "Unpause"});
  }, []);

  const goBack = useCallback(() => {
    router.push("/");
  }, [router]);

  const moveBlockLeft = useCallback(() => {
    dispatch({type: "MoveLeft", width, height});
  }, [width, height]);

  const moveBlockRight = useCallback(() => {
    dispatch({type: "MoveRight", width, height});
  }, [width, height]);

  const triggerDrop = useCallback(() => {
    dispatch({type: "Drop", width, height});
  }, [width, height]);

  useEffect(() => {
    setMounted(true);

    const startingScreenInterval = setTimeout(() => {
      dispatch({type: "DismissStartScreen"});
    }, 2000);

    if (!muteAudio) {
      audio.playIntroSound();
    }

    return () => {
      clearTimeout(startingScreenInterval);
    }
  }, [muteAudio]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const currentState = stateRef.current;
      if (currentState.startingScreenOn || currentState.gameOver) return;
      if (event.key === "Escape") {
        dispatch(currentState.gamePause ? {type: "Unpause"} : {type: "Pause"});
      }
      if (!currentState.gamePause) {
        if (event.key === "ArrowLeft") {
          moveBlockLeft();
        }
        if (event.key === "ArrowRight") {
          moveBlockRight();
        }
        if (event.key === "ArrowDown") {
          triggerDrop();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    }
  }, [moveBlockLeft, moveBlockRight, triggerDrop]);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  useEffect(() => {
    function update(time: number) {
      dispatch({
        type: "Tick",
        time,
        fastDrop: false,
        width,
        height,
        numberOfColors,
        pointsPerTetromino: pointsToAward,
        levelUpIncrement,
        startingLevel,
        dropSpeedAcceleration
      });

      rafIDRef.current = requestAnimationFrame(update);
    }

    rafIDRef.current = requestAnimationFrame(update);

    return () => {
      if (rafIDRef.current) {
        cancelAnimationFrame(rafIDRef.current);
      }
    }
  }, [width, height, numberOfColors, levelUpIncrement, startingLevel, dropSpeedAcceleration, pointsToAward]);

  useEffect(() => {
    const previousState = previousStateRef.current;
    if (!muteAudio && previousState !== null) {
      if (state.gameOver && !previousState.gameOver) {
        audio.playLoseSound();
      }
      else if (state.score > previousState.score) {
        audio.playClearSound();
      }
      else if (state.currentBlockPosition.y === 0 && previousState.currentBlockPosition.y > 0 && !state.gameOver) {
        audio.playDropSound();
      }
    }

    previousStateRef.current = state;
  }, [state, muteAudio]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`${styles.game} ${handwrittenSimlishFont.className}`} style={{transform: touchscreenMode ? `scale(${Math.min(window.innerWidth / 845, window.innerHeight / 1080)})` : undefined}}>
      <div className={styles.score} style={{width: blockSize * width + blockGap * (width - 1), fontSize: blockSize / 2, letterSpacing: blockSize / 15}}>
        <div className={`${styles.content} unselectable`} style={{paddingLeft: blockSize / 15}}>{state.score}</div>
      </div>
      <div className={styles.main}>
        <div className={styles.levelpanel} style={{width: blockSize * 1.5, height: blockSize * 1.5}}>
          <div className={`${styles.content} unselectable`}>
            <div style={{fontSize: blockSize / 3, marginTop: blockSize / 3}}>LEVEL</div>
            <div style={{fontSize: blockSize / 2, marginTop: blockSize / 9, letterSpacing: blockSize / 15}}>{state.level}</div>
          </div>
        </div>
        <div className={styles.board} style={{...sizing}}>
          {!state.gameOver && <Block color={colors[state.currentBlockQueue[0]]} x={state.currentBlockPosition.x} y={state.currentBlockPosition.y}/>}
          {
            state.board.map((row, rowIndex) => {
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
            <Block color={colors[state.currentBlockQueue[1]]}/>
          </div>
          <div className={styles.upcomingblocks} style={{width: blockSize * 0.75, height: blockSize * 0.75, marginTop: blockSize * 1.5 / 2, marginBottom: blockSize * 1.5 / 4}}>
            <Block color={colors[state.currentBlockQueue[2]]}/>
          </div>
        </div>
      </div>
      {touchscreenMode && <TouchscreenControls triggerLeft={moveBlockLeft} triggerRight={moveBlockRight} triggerDrop={triggerDrop} pauseGame={pauseGame}/>}
      {(state.startingScreenOn || state.gameOver || state.gamePause) && <div className={styles.darkscreen}></div>}
      <div className={styles.overlayscreen} style={{display: !state.gameOver ? "none" : "inline"}}>
        <h1 className={styles.titletext} style={{fontSize: blockSize * 2, color: "#c49e23"}}>GAME OVER</h1>
        <div className={styles.bottomsection}>
          <div className={styles.regulartext}>
            <span>Your final score was:</span>
            <br/>
            <span style={{fontSize: "1.5em"}}>{state.score}</span>
          </div>
          <br/>
          {onReset && <><button className={`${styles.button} ${styles.regulartext}`} onClick={onReset}>Start a new game</button><br/></>}
          <button className={`${styles.button} ${styles.regulartext}`} onClick={goBack}>Go Back</button>
        </div>
      </div>
      <div className={`${styles.overlayscreen} ${styles.startscreen}`}>
        <h1 className={styles.titletext} style={{fontSize: blockSize * 2, color: "#70c7c4"}}>START</h1>
      </div>
      <div className={styles.overlayscreen} style={{display: !state.gamePause ? "none" : "inline"}}>
        <h1 className={styles.pausedtext} style={{fontSize: blockSize * 2}}>PAUSED</h1>
        <button className={`${styles.button} ${styles.regulartext}`} onClick={unpauseGame}>Resume Game</button>
        {onReset && <><br/><button className={`${styles.button} ${styles.regulartext}`} onClick={onReset}>Restart</button></>}
        <br/>
        <button className={`${styles.button} ${styles.regulartext}`} onClick={goBack}>Go Back</button>
        <p className={styles.regulartext} style={{fontSize: 12}}>You can use ESC to pause/unpause.</p>
      </div>
    </div>
  );
}
