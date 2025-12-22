"use client";
import styles from "./page.module.css";
import {useState, useEffect} from "react";

import {useRouter} from "next/navigation";

import GameMode from "@/components/GameMode";
import IntegerTextInput from "@/components/IntegerTextInput";
import IntegerButtonInput from "@/components/IntegerButtonInput";

import CustomFont from "next/font/local";

const handwrittenSimlishFont = CustomFont({
  src: "../public/Fonts/Handwritten Simlish.woff2",
  fallback: ["sans-serif"]
});

export default function Home() {
  const router = useRouter();

  const [selectedGamemode, setSelectedGamemode] = useState<number>(1);
  const [customSettings, setCustomSettings] = useState({
    width: 5,
    height: 7,
    colors: 6,
    acceleration: 0.09,
    awardpoints: 1000,
    levelincrement: 4000,
    startinglevel: 1
  });

  const gamemodeInfo = [
    {
      name: "Original",
      description: [
        "Four colors of blocks",
        "Fast Acceleration of speed every level",
        "Lots of points given every tetromino",
        "Points are also randomised"
      ],
      target: "/original"
    },
    {
      name: "Normal",
      description: [
        "Six colors of blocks",
        "Gradual ramp up of speed every level",
        "1000 points every tetromino",
        "Level up every 4000 points"
      ],
      target: "/normal"
    }
  ];

  const triggerPlay = () => {
    if (selectedGamemode === gamemodeInfo.length) {
      const params = new URLSearchParams(Object.entries(customSettings).map(([key, value]) => [key, String(value)]));
      router.push("/custom?" + new URLSearchParams({...params}).toString());
    }
    else {
      router.push(gamemodeInfo[selectedGamemode].target);
    }
  }

  const handleNumberChange = (key: keyof typeof customSettings) => (value: string) => {
    setCustomSettings(previous => ({
      ...previous,
      [key]: value === "" ? undefined : Number(value)
    }))
  };

  return (
    <>
      <title>Blicblock</title>
      <div className={styles.homecontent}>
        <h1 style={{fontSize: 64}}>
          <span className={handwrittenSimlishFont.className} style={{fontWeight: "normal"}}>Welcome to</span>
          <br/>
          <span style={{fontSize: 96, textTransform: "uppercase"}}>Blicblock</span>
        </h1>
        <h2>Select a gamemode</h2>
        <div className={styles.gamemodes}>
          {
            gamemodeInfo.map((gamemode, index) => (
              <GameMode key={index} name={gamemode.name} description={gamemode.description} selected={index === selectedGamemode} onClick={(e) => setSelectedGamemode(index)}></GameMode>
            ))
          }
          <GameMode name="Custom" description="Select your own settings" selected={selectedGamemode === gamemodeInfo.length} onClick={(e) => setSelectedGamemode(gamemodeInfo.length)}>
            <div className={styles.customsettings}>
              <span>
                <span>Board Width</span>
                <br/>
                <span style={{fontSize: 10}}>(Minimum: 3 - Maximum: 9)</span>
              </span>
              <IntegerButtonInput value={5} min={3} max={9} step={2} onChange={handleNumberChange("width")}/>
              <span>
                <span>Board Height</span>
                <br/>
                <span style={{fontSize: 10}}>(Minimum: 3 - Maximum: 15)</span>
              </span>
              <IntegerButtonInput value={7} min={3} max={15} step={2} onChange={handleNumberChange("height")}/>
              <span>
                <span>Number of colors</span>
                <br/>
                <span style={{fontSize: 10}}>(Minimum: 2 - Maximum: 10)</span>
              </span>
              <IntegerButtonInput value={6} min={2} max={10} step={1} onChange={handleNumberChange("colors")}/>
              <span>
                <span>Points awarded per tetromino</span>
                <br/>
                <span style={{fontSize: 10}}>(Minimum: 0)</span>
              </span>
              <IntegerTextInput placeholder={1000} min={0} onChange={handleNumberChange("awardpoints")}/>
              <span>
                <span>Points per level</span>
                <br/>
                <span style={{fontSize: 10}}>(Minimum: 1)</span>
              </span>
              <IntegerTextInput placeholder={4000} min={1} onChange={handleNumberChange("levelincrement")}/>
              <span>
                <span>Starting level</span>
                <br/>
                <span style={{fontSize: 10}}>(Minimum: 1)</span>
              </span>
              <IntegerTextInput placeholder={1} min={1} onChange={handleNumberChange("startinglevel")}/>
            </div>
          </GameMode>
        </div>
        <br/>
        <button className={styles.playbutton} onClick={triggerPlay}>Play</button>
      </div>
    </>
  );
}
