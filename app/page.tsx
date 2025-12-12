"use client";
import styles from "./page.module.css";

import {useEffect} from "react";

import Game from "@/components/Game";
import Block from "@/components/Block";

export default function Home() {
  const colors = [
    "#ffffff",
    "#5ac6db",
    "#e022b1",
    "#fae07f",
    "#a4f558",
    "#d98821"
  ];

  return (
    <>
      <div className={styles.content}>
        <Game width={5} height={7} blockSize={100} blockGap={4} blockColors={colors}/>
      </div>
    </>
  );
}
