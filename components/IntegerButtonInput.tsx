"use client";
import {useState, useEffect} from "react";

interface IntegerButtonInputProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: string) => void;
}

export default function IntegerButtonInput({value = 0, min = 0, max = Number.POSITIVE_INFINITY, step = 1, onChange}: IntegerButtonInputProps) {
  const [currentValue, setCurrentValue] = useState<number>(value);

  const decreaseValue = () => {
    if (currentValue - step >= min) {
      setCurrentValue((previous) => previous - step);
    }
  }

  const increaseValue = () => {
    if (currentValue + step <= max) {
      setCurrentValue((previous) => previous + step);
    }
  }

  useEffect(() => {
    onChange(String(currentValue));
  }, [currentValue]);

  return (
    <div style={{margin: "10px 0"}}>
      <button onClick={decreaseValue}>&lt;</button>
      <span>{currentValue}</span>
      <button onClick={increaseValue}>&gt;</button>
    </div>
  );
}
