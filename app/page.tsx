"use client";
import styles from "./page.module.css";

import {useEffect} from "react";

import Game from "@/components/Game";
import Block from "@/components/Block";

export default function Home() {
  const colors = [
    "#ffffff",
    "#439cae",
    "#AF197C",
    "#B7A45D",
    "#6EAB34",
    "#AF6D19"
  ];

  return (
    <>
      <Game width={5} height={7} blockSize={100} blockGap={4} blockColors={colors}/>
    </>
  );
}
